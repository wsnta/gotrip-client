import { createRequestor } from './requestor';

export {
    createRequestor,
} from './requestor';
export type {
    DataRequestor,
    RequestProperty,
} from './requestor-model';

export {
    useRequest,
} from './hook';
export type {
    BundleErrorTransform,
    BundleTransform,
    OnRequestComplete,
    useRequestReturnValue,
} from './hook';

/** Side effect */
/** Requestor này dùng để share cache cho các dạng query sau:
 * * `meta` của resource
 */
export const GlobalRequestor = createRequestor();
/** End of side effect */