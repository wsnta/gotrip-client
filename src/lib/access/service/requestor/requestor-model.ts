import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheRecord, RequestorCacheConfig } from './requestor-cache';
import { ActualAxiosMethod } from './requestor-apply';
import { RequestorTimeCacheConfig, TimeCacheRecord } from './requestor-cache-by-time';

export type RequestProperty = {
    cache?: string | boolean,
    cleanable?: boolean,
}
export type RequestorProperty = RequestorCacheConfig
& RequestorTimeCacheConfig
& {
    silent?: boolean,
};

/**
 * Type này sử dụng kỹ thuật mixin function và object, nghĩa là một property
 * vừa là hàm (gọi được như hàm) vừa chứa những property khác.
 * Ví dụ property `request`:
 * * Gọi được dưới dạng một hàm: `request(config, property)`
 * * Chứa property như một object: `request.GET(url, config, property)`
 */
export type DataRequestor = {
    setCacheResponse: (key: string, response: Promise<AxiosResponse<any>>) => Promise<void>,
    cleanCache: (ratio?: number, forceClean?: boolean) => void,
    clearFreeCache: () => void,
    searchCache: (criteria: string) => CacheRecord | undefined,
    searchFulfilledCache: (criteria: string) => CacheRecord | undefined,
    addCache: (key: string, resultResponse: AxiosResponse<any>, config: AxiosRequestConfig, cleanable?: boolean) => void,

    request: {
        <T = any>(
            config?: AxiosRequestConfig,
            property?: RequestProperty,
        ): Promise<AxiosResponse<T>>,
    } & Record<ActualAxiosMethod, <T = any>(
        url: string,
        config?: AxiosRequestConfig,
        property?: RequestProperty,
    ) => Promise<T>>,

    cacheRequest: {
        <T = any>(
            config?: AxiosRequestConfig,
            cacheKey?: string,
            cleanable?: boolean,
        ): Promise<AxiosResponse<T>>
    } & Record<ActualAxiosMethod, <T = any>(
        url: string,
        config?: AxiosRequestConfig,
        cacheKey?: string,
        cleanable?: boolean,
    ) => Promise<T>>,

    _experimental_cacheRequest: {
        <T = any>(
            cacheKey: string,
            cacheId: string,
            config?: AxiosRequestConfig,
            forceOverwrite?: boolean,
            cleanable?: boolean,
        ): Promise<AxiosResponse<T>>
    } & Record<ActualAxiosMethod, <T = any>(
        url: string,
        cacheKey: string,
        cacheId: string,
        config?: AxiosRequestConfig,
        forceOverwrite?: boolean,
        cleanable?: boolean,
    ) => Promise<T>>,
    cacheMethod: {
        setCacheResponse: (
            cacheName: string,
            cacheId: string,
            response: Promise<AxiosResponse<any>>,
            timeToLive?: number,
        ) => Promise<void>,
        cleanCache: (staleThreshold?: number, force?: boolean) => void,
        clearCache: (force?: boolean) => void,
        searchCache: (cacheName: string, cacheId: string) => TimeCacheRecord | undefined,
        searchUsableCache: (cacheName: string, id: string) => TimeCacheRecord | undefined,
        checkCache: (cacheKey: string, cacheId: string, config: AxiosRequestConfig, cleanable?: boolean) => boolean,
    }

    cancellableRequest: () => {
        request<T = any>(config?: AxiosRequestConfig, property?: RequestProperty): Promise<AxiosResponse<T>>;
        cancel: () => void;
    },
};