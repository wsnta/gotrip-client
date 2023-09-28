import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { clone } from 'ramda';

export type RequestorTimeCacheConfig = {
    staleTime?: number,
    externalTimeCacheMap?: Record<string, Record<string, TimeCacheRecord>>,
}

export type TimeCacheRecord = {
    response: Promise<AxiosResponse<any>> | any,
    data: any,
    status: 'initialized' | 'fullfilled' | 'rejected',
    timeToLive: number,
    lastUpdated: number,
    isLocked: number,
    cleanable: boolean,
    config: AxiosRequestConfig,
    /**
     * Query count chỉ đếm số lần query thật (không tính cache hit)
     */
    queryCount: number,
}

export const DEFAULT_STALE_TIME = 30 * 60 * 1000;

const getCurrentTime = () => new Date().getTime();
export const createTimeCacheMap = (
    config: Pick<RequestorTimeCacheConfig, 'staleTime' | 'externalTimeCacheMap'> & { silent?: boolean },
) => {
    const {
        staleTime = DEFAULT_STALE_TIME,
        externalTimeCacheMap,
        silent = true,
    } = config;
    let cacheMap: Record<string, Record<string, TimeCacheRecord>> = externalTimeCacheMap ?? {};
    const log = (...args: any[]) => {
        if (!silent) console.log(...args);
    };

    const getCache = (cacheKey: string, cacheId: string) => {
        return cacheMap[cacheKey]?.[cacheId] as TimeCacheRecord | undefined;
    };
    const checkCache = (cacheKey: string, cacheId: string, config: AxiosRequestConfig, cleanable = true) => {
        const target = getCache(cacheKey, cacheId);
        if(!target || target.status === 'rejected') {
            if (cacheMap[cacheKey] == null) cacheMap[cacheKey] = {};
            cacheMap[cacheKey][cacheId] = {
                response: Promise.resolve({
                    data: undefined,
                    status: 200,
                    statusText: '',
                    headers: {},
                    config,
                }),
                data: undefined,
                status: 'initialized',
                lastUpdated: getCurrentTime(),
                timeToLive: DEFAULT_STALE_TIME,
                isLocked: 0,
                queryCount: 0,
                cleanable,
                config,
            };
            log(
                `createTimeCacheMap:checkCache Cache missed with cacheKey ${cacheKey}, create new entry`,
                cacheMap[cacheKey],
            );

            return false;
        } else {
            if (getCurrentTime() - target.lastUpdated > target.timeToLive) {
                target.lastUpdated = getCurrentTime();
                log(
                    `createTimeCacheMap:checkCache Cache hit with cacheKey ${cacheKey}, but it ran out its TTL`,
                    target,
                );
                return false;
            }
            log(
                `createTimeCacheMap:checkCache Cache hit with cacheKey ${cacheKey}, use current entry`,
                target,
            );
            return true;
        }
    };
    const getCacheResponse = async (cacheKey: string, cacheId: string) => {
        const target = getCache(cacheKey, cacheId);

        if (!target) return undefined;
        /**
         * Tránh infinite loop khi có lỗi xảy ra lúc đếm query
         */
        for (let waitCnt = 0; waitCnt < 16; waitCnt++) {
            const currentQueryCount = target.queryCount;
            const response = await target.response;
            if (target && currentQueryCount === target.queryCount) {
                return response;
            }
        }
        return undefined;
    };
    const setCacheResponse = async (
        cacheKey: string,
        cacheId: string,
        response: Promise<AxiosResponse<any>>,
    ) => {
        const target = getCache(cacheKey, cacheId);

        if (target) try {
            target.response = response;
            target.queryCount += 1;

            const currentQueryCount = target.queryCount;
            const { data } = (await response) ?? {};

            if (target && currentQueryCount === target.queryCount) {
                target.lastUpdated = getCurrentTime();
                target.status = 'fullfilled';
                target.data = data;
            }
        } catch (e: any) {
            /** Giao exception cho caller xử lý */
            target.lastUpdated = getCurrentTime();
            target.status = 'rejected';
            throw e;
        }
    };

    const searchCache = (cacheKey: string, cacheId: string) => {
        let target = getCache(cacheKey, cacheId);

        if (!target) return undefined;
        return {
            ...target,
            config: clone(target.config),
        };
    };
    const searchUsableCache = (...args: Parameters<typeof searchCache>) => {
        const cachedTarget = searchCache(...args);
        return (cachedTarget
            && (cachedTarget.status === 'fullfilled' || cachedTarget.status === 'initialized')
            && (getCurrentTime() - cachedTarget.lastUpdated <= staleTime))
            ? cachedTarget
            : undefined;
    };
    const cleanCache = (staleThreshold = staleTime, force = false) => {
        for (const [cacheName, cacheStash] of Object.entries(cacheMap)) {
            for (const [key, { cleanable, isLocked, lastUpdated }] of Object.entries(cacheStash)) {
                if ((getCurrentTime() - lastUpdated > staleThreshold) && (cleanable || force) && isLocked === 0) {
                    delete cacheStash[key];
                }
                if (Object.keys(cacheStash).length === 0) delete cacheMap[cacheName];
            }
        }
    };
    const clearCache = (force = false) => {
        for (const [cacheName, cacheStash] of Object.entries(cacheMap)) {
            for (const [key, { cleanable, isLocked }] of Object.entries(cacheStash)) {
                if (isLocked <= 0 && (cleanable || force)) {
                    delete cacheStash[key];
                }
                if (Object.keys(cacheStash).length === 0) delete cacheMap[cacheName];
            }
        }
    };
    const lockCache = (cacheKey: string, cacheId: string) => {
        const target = getCache(cacheKey, cacheId);

        if (target) target.isLocked += 1;
    };
    const unlockCache = (cacheKey: string, cacheId: string) => {
        const target = getCache(cacheKey, cacheId);

        if (target) target.isLocked -= 1;
    };

    return {
        checkCache,
        getCache,
        getCacheResponse,
        setCacheResponse,

        searchCache,
        searchUsableCache,
        cleanCache,
        clearCache,
        lockCache,
        unlockCache,
    };
};