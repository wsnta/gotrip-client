import { AxiosRequestConfig } from 'axios';

export const transformRequestConfig = (config: AxiosRequestConfig): AxiosRequestConfig => {
    return {
        ...config,
        headers: {
            ...config?.headers,
            ...(config?.data?.['_etag']
                ? { 'if-match': config.data['_etag'] }
                : {}),
        },
    };
};