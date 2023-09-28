import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type ActualAxiosMethod = NonNullable<AxiosRequestConfig['method']>;
export const methodList: ActualAxiosMethod[] = [
    'get', 'GET',
    'delete', 'DELETE',
    'head', 'HEAD',
    'options', 'OPTIONS',
    'post', 'POST',
    'put', 'PUT',
    'patch', 'PATCH',
    'purge', 'PURGE',
    'link', 'LINK',
    'unlink', 'UNLINK',
];

/**
 * Ghép các kiểu query với các query method có sẵn.
 * Ví dụ khi gọi hàm này với hàm query có cache (`cachedRequest`), ta sẽ nhận được hàm query
 * có cache với các property mới đã ghép sẵn query method như sau:
 * * Gọi hàm như bình thường:
 *   * `cachedRequest(...)`
 * * Gọi hàm đã ghép sẵn query
 *   * `cachedRequest.GET(...)`
 *   * `cachedRequest.POST(...)`
 * @param requestFunction Hàm query
 * @returns Hàm query truyền vào, nhưng với các phương thức ứng mới với các query method của `axios`
 */
export const applyMethodToRequest = <F extends any[]>(
    requestFunction: <T = any>(config?: AxiosRequestConfig, ...args: F) => Promise<AxiosResponse<T>>,
) => {
    const appliedMethodMap: Record<any, <T = any>(url: string, config?: AxiosRequestConfig, ...args: F) => Promise<T>> = {};

    methodList.forEach(methodName => {
        async function appliedMethodRequest<T = any>(url: string, config?: AxiosRequestConfig, ...args: F) {
            return (await requestFunction<T>({
                method: methodName,
                url,
                ...config,
            }, ...args)).data;
        }
        appliedMethodMap[methodName] = appliedMethodRequest;
    });

    return Object.assign(
        requestFunction,
        appliedMethodMap,
    ) as {
        <T = any>(
            config?: AxiosRequestConfig,
            ...args: F
        ): Promise<AxiosResponse<T>>
    } & Record<ActualAxiosMethod, <T = any>(
        url: string,
        config?: AxiosRequestConfig,
        ...args: F
    ) => Promise<T>>;
};
export const applyMethodToCacheRequest = <F extends any[]>(
    requestFunction: <T = any>(
        cacheKey: string,
        cacheId: string,
        config?: AxiosRequestConfig,
        ...args: F
    ) => Promise<AxiosResponse<T>>,
) => {
    const appliedMethodMap: Record<any, <T = any>(
        url: string,
        cacheKey: string,
        cacheId: string,
        config?: AxiosRequestConfig,
        ...args: F
    ) => Promise<T>> = {};

    methodList.forEach(methodName => {
        async function appliedMethodRequest<T = any>(
            url: string,
            cacheKey: string,
            cacheId: string,
            config?: AxiosRequestConfig,
            ...args: F
        ) {
            return (await requestFunction<T>(
                cacheKey,
                cacheId,
                {
                    method: methodName,
                    url,
                    ...config,
                },
                ...args,
            )).data;
        }
        appliedMethodMap[methodName] = appliedMethodRequest;
    });

    return Object.assign(
        requestFunction,
        appliedMethodMap,
    ) as {
        <T = any>(
            cacheKey: string,
            cacheId: string,
            config?: AxiosRequestConfig,
            ...args: F
        ): Promise<AxiosResponse<T>>
    } & Record<ActualAxiosMethod, <T = any>(
        url: string,
        cacheKey: string,
        cacheId: string,
        config?: AxiosRequestConfig,
        ...args: F
    ) => Promise<T>>;
};