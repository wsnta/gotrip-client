import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { clone } from 'ramda';

export type RequestorCacheConfig = {
    maxCacheSize?: number,
    cacheCleanRatio?: number,
    externalCacheMap?: Record<string, CacheRecord>,
}

export type CacheRecord = {
    response: Promise<AxiosResponse<any>> | any,
    data: any,
    status: 'initialized' | 'fullfilled' | 'rejected',
    size: number,
    accessCount: number,
    isLocked: number,
    cleanable: boolean,
    config: AxiosRequestConfig,
}

export const cacheSortFunction: (
    L: [string, CacheRecord],
    R: [string, CacheRecord],
) => number = (
    [, { accessCount: accessCountF, size: sizeF }],
    [, { accessCount: accessCountL, size: sizeL }],
) => {
    if (accessCountF < accessCountL) return -1;
    if (accessCountF === accessCountL) return -(sizeF - sizeL);
    return 1;
};

export const DefaultCacheCleanRatio = 0.65;
export const DefaultMaxCacheSize = 1024 * 1024 * 1024 * 10;

export const createCacheMap = (
    config: Pick<RequestorCacheConfig, 'cacheCleanRatio' | 'externalCacheMap' | 'maxCacheSize'> & { silent?: boolean },
) => {
    let cacheSize = 0;
    const {
        cacheCleanRatio = DefaultCacheCleanRatio,
        maxCacheSize = DefaultMaxCacheSize,
        externalCacheMap,
        silent = true,
    } = config;
    let cacheMap: Record<string, CacheRecord> = externalCacheMap ?? {};

    const getCache = (key: string) => {
        return cacheMap[key];
    };
    const checkCache = (key: string, config: AxiosRequestConfig, cleanable = true) => {
        const target = getCache(key);
        if(!target || target.status === 'rejected') {
            cacheMap[key] = {
                response: Promise.resolve({
                    data: undefined,
                    status: 200,
                    statusText: '',
                    headers: {},
                    config,
                }),
                data: undefined,
                status: 'initialized',
                size: 0,
                accessCount: 1,
                isLocked: 0,
                cleanable,
                config,
            };
            if (!silent) console.log(`createCacheMap:checkCache Cache missed with key ${key}, create new entry`, cacheMap[key]);

            return false;
        } else {
            target.accessCount += 1;
            if (!silent) console.log(`createCacheMap:checkCache Cache hit with key ${key}, use current entry`, target);
            return true;
        }
    };
    const addCache = (key: string, resultResponse: AxiosResponse<any>, config: AxiosRequestConfig, cleanable = true) => {
        cacheMap[key] = {
            response: Promise.resolve(resultResponse),
            data: undefined,
            status: 'fullfilled',
            size: 1024, /** @todo Setup lại caching, cache theo size khá sai lầm về chiến lược, lẽ ra nên cache theo TTL */
            accessCount: 1,
            isLocked: 0,
            cleanable,
            config,
        };
    };
    const getCacheResponse = (key: string) => getCache(key).response;
    const setCacheResponse = async (key: string, response: Promise<AxiosResponse<any>>) => {
        const target = getCache(key);

        try {
            target.response = response;

            const { headers, data } = (await response) ?? {};

            /** Xử lý trường hợp size bằng 0 / không hợp lệ để tránh làm sai hàm clean cache */
            const parsedSize = parseInt(headers?.['content-length']);
            const normalizedSize = isNaN(parsedSize) || typeof parsedSize !== 'number' || parsedSize <= 0
                ? 1024
                : parsedSize;
            target.size = normalizedSize;
            target.status = 'fullfilled';
            target.data = data;
            cacheSize += normalizedSize;
        } catch (e: any) {
            /** Giao exception cho caller xử lý */
            target.status = 'rejected';
            throw e;
        }
    };

    const searchCache = (criteria: string) => {
        let target = getCache(criteria);

        if (!target) return undefined;
        return {
            ...target,
            config: clone(target.config),
        };
    };
    const searchFulfilledCache = (...args: Parameters<typeof searchCache>) => {
        const cachedTarget = searchCache(...args);
        return cachedTarget?.status === 'fullfilled'
            ? cachedTarget
            : undefined;
    };
    const checkFreeCache = () => {
        if (cacheSize > maxCacheSize) cleanCache();
    };
    const cleanCache = (ratio = cacheCleanRatio, forceClean = false) => {
        const sortedCache = Object.entries(cacheMap).sort(cacheSortFunction);
        const cleanThreshold = ratio * maxCacheSize;
        let currentSize = cacheSize;

        if(cacheSize > maxCacheSize || forceClean) {
            sortedCache.forEach(([
                key,
                { size, cleanable, isLocked },
            ]) => {
                if (currentSize > cleanThreshold && cleanable && isLocked === 0) {
                    delete cacheMap[key];
                    cacheSize -= size;
                    currentSize -= size;
                }
            });
        }
    };
    const lockCache = (id: string) => cacheMap[id].isLocked += 1;
    const unlockCache = (id: string) => cacheMap[id].isLocked -= 1;
    const clearFreeCache = () => {
        Object.entries(cacheMap).forEach(([key, entry]) => {
            const { size, isLocked } = entry;

            if (isLocked === 0) {
                delete cacheMap[key];
                cacheSize -= size;
            }
        });
    };

    return {
        addCache,

        checkCache,
        getCache,
        getCacheResponse,
        setCacheResponse,

        searchCache,
        searchFulfilledCache,
        cleanCache,
        lockCache,
        unlockCache,
        checkFreeCache,
        clearFreeCache,
    };
};