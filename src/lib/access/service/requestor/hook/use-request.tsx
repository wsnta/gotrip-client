import { useRef, useReducer, useEffect } from 'react';
import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { createRequestor } from '../requestor';
import { isConsecutiveRequest } from '../../analyze-error';
import { RequestReducer, requestReducer, useRequestBundle } from './reducer';
import { RequestProperty } from '../requestor-model';
import { CacheRecord } from '../requestor-cache';
import { transformRequestConfig } from '../../config-transform';

type HookRequestProperty = RequestProperty & { errorOnDebounce?: boolean, cleanPreviousRequest?: boolean };
const defaultProperty: HookRequestProperty = {
    cache: false,
    errorOnDebounce: false,
    cleanPreviousRequest: true,
};

type useRequestRefetch<Data = any> = (
    url?: string,
    fetcherConfig?: Omit<AxiosRequestConfig, 'url'>,
) => Promise<AxiosResponse<Data> | undefined>
export type useRequestReturnValue<Data, TransformedData> = [
    Readonly<useRequestBundle<Data, TransformedData>>,
    useRequestRefetch<Data>,
];

type PreProcessBundle<Data = any> = {
    isLoading: boolean,
    data: Data,
    error?: AxiosError<Data>,
    response: AxiosResponse<Data>,
}
export type BundleTransform<Data = any, TransformedData = Data> = (
    bundle: Readonly<PreProcessBundle<Data>>
) => TransformedData | Promise<TransformedData>;

type PreProcessErrorBundle<Data = any> = {
    isLoading: boolean,
    error?: AxiosError<Data>,
}
export type BundleErrorTransform<Data = any, TransformedData = Data> = (
    bundle: Readonly<PreProcessErrorBundle<Data>>
) => TransformedData | Promise<TransformedData>;

export type OnRequestComplete<Data = any, TransformedData = Data> = (
    status: 'SUCCESS' | 'FAILURE',
    bundle: Readonly<useRequestBundle<Data, TransformedData>>,
    refetcher: useRequestRefetch<Data>,
) => void;
type RequestEvent<Data = any, TransformedData = Data> = {
    onRequestSuccess?: BundleTransform<Data, TransformedData>,
    onRequestFailure?: BundleErrorTransform<Data, TransformedData>,
    onRequestComplete?: OnRequestComplete<Data, TransformedData>,
}
const defaultCompleteEvent: Required<RequestEvent> = {
    onRequestSuccess: bundle => bundle.data,
    onRequestFailure: () => undefined,
    onRequestComplete: () => { },
};

const CentralRequestor = createRequestor();
export function useRequest<Data = any, TransformedData = Data>(
    url: string = '',
    method: AxiosRequestConfig['method'] = 'get',
    property: HookRequestProperty = defaultProperty,
    completeEvent: RequestEvent<Data, TransformedData> = defaultCompleteEvent,
    initConfig: Omit<AxiosRequestConfig, 'url'> = {},
): useRequestReturnValue<Data, TransformedData> {
    const { cache } = property;
    const attemptCount = useRef(0);
    const isMounted = useRef(true);
    const [useRequestBundle, dispatch] = useReducer<RequestReducer<Data, TransformedData>>(
        requestReducer,
        {
            isIdling: true,
            isMounted: false,
            isLoading: false,
            data: undefined,
            error: undefined,
            response: undefined,
            transformedData: undefined,
            queryCount: 0,
        },
    );
    const isValidURL = (url?: string) => (url?.length ?? 0) > 0;
    const fetch = async (
        fetcherConfig?: AxiosRequestConfig,
    ): Promise<AxiosResponse<Data>> => {
        const {
            onRequestSuccess: inFetchOnRequestSuccess,
            onRequestFailure: inFetchOnRequestFailure,
        } = { ...defaultCompleteEvent, ...completeEvent };
        const {
            cache: inFetchCache,
            errorOnDebounce: inFetchErrorOnDebounce,
            cleanPreviousRequest: inFetchCleanPreviousRequest,
        } = { ...defaultProperty, ...property };

        if (inFetchCleanPreviousRequest) attemptCount.current += 1;
        const currentAttempt = attemptCount.current;

        try {
            let response: AxiosResponse<any>;
            let cachedRepsonse: CacheRecord | undefined;
            /**
             * Nếu cache hit thì không query lại
             */
            const url = fetcherConfig?.url;
            if (inFetchCache && url) {
                cachedRepsonse = CentralRequestor.searchCache(typeof inFetchCache === 'boolean' ? url : inFetchCache);
            }
            if (cachedRepsonse?.status === 'fullfilled') {
                response = await cachedRepsonse.response;
            } else {
                dispatch({ type: 'set_loading', payload: true });
                response = await CentralRequestor.request(
                    transformRequestConfig({
                        url,
                        method,
                        ...initConfig,
                        ...fetcherConfig,
                    }),
                    {
                        cache: inFetchCache,
                    },
                );
            }

            const newPreBundle: PreProcessBundle<Data> = {
                isLoading: false,
                response: response,
                error: undefined,
                data: response.data,
            };
            const newBundle = {
                ...newPreBundle,
                transformedData: await inFetchOnRequestSuccess(newPreBundle),
            };

            /**
             * @todo Theo cách cài đặt này, ta vẫn return response ngay cả khi nó đã cũ, hành vi này có thể gây ảnh hưởng lên những vị trí await hàm fetch, cần khảo sát thêm.
             */
            if (isMounted.current && attemptCount.current === currentAttempt) {
                dispatch({
                    type: 'set_bundle_and_count',
                    payload: newBundle,
                });
            }
            return response;
        } catch (error: any) {
            const isCancelled = isConsecutiveRequest(error);
            const newPreErrorBundle: PreProcessErrorBundle<Data> = {
                isLoading: isCancelled ? true : false,
                error: (isCancelled && inFetchErrorOnDebounce === false) ? undefined : error,
            };
            const newErrorBundle = {
                ...newPreErrorBundle,
                response: undefined,
                data: undefined,
                transformedData: await inFetchOnRequestFailure(newPreErrorBundle),
            };

            if (isMounted.current && attemptCount.current === currentAttempt) {
                dispatch({
                    type: 'set_bundle_and_count',
                    payload: newErrorBundle,
                });
            }
            return (isCancelled && inFetchErrorOnDebounce === false) ? undefined : error;
        }
    };

    const refetch: useRequestRefetch<Data> = async (
        overridenURL = url,
        refetchConfig = {},
    ) => {
        if (isValidURL(overridenURL)) {
            return await fetch({ url: overridenURL, ...refetchConfig });
        }
    };

    useEffect(() => {
        /** Does not query if url is not present */
        if (isValidURL(url)) {
            fetch({ url });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, method, JSON.stringify(initConfig), cache]);

    useEffect(() => {
        const { onRequestComplete } = completeEvent;
        const isError = useRequestBundle.error !== undefined && useRequestBundle.error !== null;

        if (onRequestComplete && useRequestBundle.queryCount !== 0) {
            onRequestComplete(
                isError ? 'FAILURE' : 'SUCCESS',
                useRequestBundle,
                refetch,
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useRequestBundle.queryCount]);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    return [
        useRequestBundle,
        refetch,
    ];
};