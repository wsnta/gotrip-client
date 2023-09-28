// import { INTENTIONAL_CANCEL } from 'lib/access/model';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { createCacheMap } from './requestor-cache';
import { applyMethodToCacheRequest, applyMethodToRequest } from './requestor-apply';
import {
    RequestProperty,
    DataRequestor,
    RequestorProperty,
} from './requestor-model';
import { createTimeCacheMap } from './requestor-cache-by-time';
import { transformRequestConfig } from '../config-transform';
import { INTENTIONAL_CANCEL } from 'lib/access/model/requestor';

const cancelTokenSource = axios.CancelToken;

export const createRequestor = (
    defaultRequestConfig?: Partial<AxiosRequestConfig>,
    defaultRequestProperty: RequestProperty = { cache: false },
    requestorProperty?: RequestorProperty,
): DataRequestor => {
    const cancelMessage = (name: string) => `${INTENTIONAL_CANCEL} with key ${name}`;
    const requestor = axios.create({
        timeout: 30000,
        withCredentials: true,
        validateStatus: status => (status >= 200 && status < 300) || status === 416,
        ...defaultRequestConfig,
    });

    // [DEAL WITH CACHE V2]
    const timeCacheBundle = createTimeCacheMap({ ...requestorProperty });

    async function baseTimeCacheRequest<T = any>(
        cacheKey: string,
        cacheId: string,
        config?: AxiosRequestConfig | string,
        forceOverwrite = false,
        cleanable = true,
    ): Promise<AxiosResponse<T>> {
        const normalizedConfig = typeof config === 'string'
            ? { url: config }
            : config ?? {};
        const isCacheInvalidated = !timeCacheBundle.checkCache(cacheKey, cacheId, normalizedConfig, cleanable);

        timeCacheBundle.lockCache(cacheKey, cacheId);
        let responseData: AxiosResponse<any> | undefined = undefined;
        try {
            if (isCacheInvalidated || forceOverwrite) {
                await timeCacheBundle.setCacheResponse(
                    cacheKey,
                    cacheId,
                    (async () => {
                        const response = await requestor.request<T, AxiosResponse<T>>(transformRequestConfig({
                            ...defaultRequestConfig,
                            ...normalizedConfig,
                        }));

                        return response;
                    })());
            }

            responseData = await timeCacheBundle.getCacheResponse(cacheKey, cacheId);
        } catch(e) {
            throw e;
        } finally {
            timeCacheBundle.unlockCache(cacheKey, cacheId);
        }

        return responseData as AxiosResponse<T>;
    };
    const timeCacheRequest = applyMethodToCacheRequest(baseTimeCacheRequest);

    // [DEAL WITH CACHE]
    const {
        addCache,
        setCacheResponse, getCacheResponse,
        checkCache,
        lockCache, unlockCache, searchCache, searchFulfilledCache,
        cleanCache, clearFreeCache, checkFreeCache,
    } = createCacheMap({ ...requestorProperty });

    async function baseCacheRequest<T = any>(
        config?: AxiosRequestConfig | string,
        cacheKey?: string,
        cleanable: boolean = true,
    ): Promise<AxiosResponse<T>> {
        const normalizedConfig = typeof config === 'string'
            ? { url: config }
            : config ?? {};
        const normalizedCacheKey = (typeof cacheKey === 'string' ? cacheKey : normalizedConfig?.url) ?? '';
        const isCreateNewCache = !checkCache(normalizedCacheKey, normalizedConfig, cleanable);

        lockCache(normalizedCacheKey);
        let responseData: AxiosResponse<any> | undefined = undefined;
        try {
            if (isCreateNewCache) {
                await setCacheResponse(
                    normalizedCacheKey,
                    (async () => {
                        const response = await requestor.request<T, AxiosResponse<T>>(transformRequestConfig({
                            ...defaultRequestConfig,
                            ...normalizedConfig,
                        }));

                        return response;
                    })());
            }

            responseData = await getCacheResponse(normalizedCacheKey);
        } catch(e) {
            throw e;
        } finally {
            unlockCache(normalizedCacheKey);
        }

        checkFreeCache();
        return responseData as AxiosResponse<T>;
    };
    const cacheRequest = applyMethodToRequest(baseCacheRequest);

    // [DEAL WITH CANCELLABLE]
    let cancellableRequestCount = 0;
    function cancellableRequest() {
        cancellableRequestCount += 1;
        const nextKey = `private-request-${cancellableRequestCount}${Math.random()}`;
        let privateTokenSource = cancelTokenSource.source();
        let cancel = () => {
            privateTokenSource.cancel(cancelMessage(nextKey));
            privateTokenSource = cancelTokenSource.source();
        };

        return {
            async request<T = any>(
                config: AxiosRequestConfig = {},
                property: RequestProperty,
            ): Promise<AxiosResponse<T>> {
                const normalizedProperty = {
                    ...defaultRequestProperty,
                    ...property,
                };

                const response = await baseRequest(transformRequestConfig({
                    ...config,
                    cancelToken: privateTokenSource.token,
                }), normalizedProperty);

                return response;
            },
            cancel,
        };
    };

    // [BASE REQUEST]
    async function baseRequest <T = any>(
        config: AxiosRequestConfig | string = {},
        property?: RequestProperty,
    ): Promise<AxiosResponse<T>> {
        const normalizedConfig = typeof config === 'string'
            ? { url: config }
            : config;
        const {
            cache = false,
            cleanable = true,
        } = {
            ...defaultRequestProperty,
            ...property,
        };
        const cacheKey = (typeof cache === 'boolean' ? normalizedConfig.url : cache) ?? '';
        const isCaching = cacheKey !== ''
            && cache !== false
            && cache !== undefined
            && cache !== null;

        if(isCaching) {
            return baseCacheRequest(normalizedConfig, cacheKey, cleanable) as unknown as AxiosResponse<T>;
        } else {
            return requestor.request(transformRequestConfig({
                ...defaultRequestConfig,
                ...normalizedConfig,
            }));
        }
    }
    const request = applyMethodToRequest(baseRequest);

    return {
        request,
        cacheRequest,
        setCacheResponse,
        cancellableRequest,
        searchCache,
        searchFulfilledCache,
        cleanCache,
        clearFreeCache,
        addCache,

        _experimental_cacheRequest: timeCacheRequest,
        cacheMethod: {
            setCacheResponse: timeCacheBundle.setCacheResponse,
            cleanCache: timeCacheBundle.cleanCache,
            clearCache: timeCacheBundle.clearCache,
            searchCache: timeCacheBundle.searchCache,
            searchUsableCache: timeCacheBundle.searchUsableCache,
            checkCache: timeCacheBundle.checkCache,
        },
    };
};