import { AxiosError, AxiosResponse } from 'axios';

export type useRequestBundle<Data = any, TransformedData = any> = {
    isIdling: boolean,
    isLoading: boolean,
    isMounted: boolean,
    data?: Data,
    transformedData?: TransformedData,
    error?: AxiosError<Data>,
    response?: AxiosResponse<Data>,
    queryCount: number,
};

type RequestAction<Data, TransformedData> = { type: 'set_loading', payload: boolean }
| { type: 'set_mounted', payload: boolean }
| { type: 'set_idling', payload: boolean }
| { type: 'set_error', payload: AxiosError<Data> }
| { type: 'set_data', payload: Data }
| { type: 'set_transformed_data', payload: TransformedData }
| { type: 'set_response', payload: AxiosResponse<Data> }
| { type: 'set_bundle', payload: Partial<useRequestBundle<Data>> }
| { type: 'set_bundle_and_count', payload: Partial<useRequestBundle<Data>> }
| { type: 'set_count' }
export type RequestReducer<Data, TransformedData> = (
    state: useRequestBundle<Data, TransformedData>,
    action: RequestAction<Data, TransformedData>,
) => useRequestBundle<Data, TransformedData>;
export function requestReducer<Data, TransformedData>(
    state: useRequestBundle<Data, TransformedData>,
    action: RequestAction<Data, TransformedData>,
): useRequestBundle<Data, TransformedData> {
    switch (action.type) {
        case 'set_data':
            return { ...state, data: action.payload };
        case 'set_transformed_data':
            return { ...state, transformedData: action.payload };
        case 'set_loading':
            return { ...state, isLoading: action.payload };
        case 'set_mounted':
            return { ...state, isMounted: action.payload };
        case 'set_idling':
            return { ...state, isIdling: action.payload };
        case 'set_response':
            return { ...state, response: action.payload };
        case 'set_error':
            return { ...state, error: action.payload };
        case 'set_count':
            return { ...state, queryCount: state.queryCount + 1 };
        case 'set_bundle':
            return { ...state, ...action.payload };
        case 'set_bundle_and_count':
            return {
                ...state,
                ...action.payload,
                isMounted: true,
                isIdling: false,
                queryCount: state.queryCount + 1,
            };
        default: throw new Error('Undefined Action');
    }
}