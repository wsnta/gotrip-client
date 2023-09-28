
import { DefaultErrorObjectMap, ErrorObject, HTTPError, INTERNAL_ERROR_ABORTED, INTERNAL_ERROR_GENERIC_ERROR, INTERNAL_ERROR_NO_ERROR, INTERNAL_EVENT_CONSECUTIVE_REQUEST, INTERNAL_EVENT_INTENTIONAL_ABORTED, getDefaultErrorObject } from 'lib/access/model/http-error';
import { FLUSH_PREVIOUS_REQUEST, INTENTIONAL_CANCEL } from 'lib/access/model/requestor';

export const getHTTPErrorCode = (err: any): HTTPError => {
    try {
        /**
         * Error Type 0: Error truyền vào là ObjectError
         */
        if (err?.__isErrorObject) return (err as ErrorObject).code as HTTPError;
        /**
         * Error Type 1: Chỉ có message thuần túy, được throw bởi thư viện FE
         */
        if (err?.message) {
            if (err.message.startsWith(FLUSH_PREVIOUS_REQUEST)) return INTERNAL_EVENT_CONSECUTIVE_REQUEST;
            if (err.message.startsWith(INTENTIONAL_CANCEL)) return INTERNAL_EVENT_INTENTIONAL_ABORTED;
            if (DefaultErrorObjectMap[err.message as HTTPError]) return `${err.message}` as HTTPError;
        }

        /**
         * Error Type 2: Error dạng response trả về từ server (nghĩa là axios request thành công)
         * 
         * Lỗi đôi khi wrap bên ngoài với key response, nên ta sẽ thử lấy nó ra trước.
         * ```
        {
            config: Record<string, any>,
            data: { message: string, code: number, [k: string]: any },
            headers: Record<string, any>,
            request: XMLHttpRequest,
            status: number,
            statusText: string,
        }
        ```
        */
        const errorResponse = err?.response ?? err;
        if (errorResponse?.status || errorResponse?.data || errorResponse?.code) {
        /** 
        * Error có variant từ server dạng 6 chữ số, bắt đầu bằng 3 chữ số đại diện cho status, ví dụ "400383", "500212"
        * 
        * Nếu lỗi là nguyên vẹn response thì code lỗi sẽ nằm bên trong object data, nên ta sẽ thử lấy nó ra trước
        */
            const code = errorResponse.data?.code ?? errorResponse?.code;
            if (typeof code === 'number' && `${code}`.length >= 4) return `${code}`.slice(0, 3) as HTTPError;
            /** 
            * Status code của HTTPRequest
            */
            if (errorResponse?.status) return `${errorResponse?.status}` as HTTPError ?? INTERNAL_ERROR_GENERIC_ERROR;
        }

        /**
         * Error Type 3: Status code được truyền trực tiếp (ví dụ thông qua một thư viện hay API nào đó), ví dụ "404", "500"
         * 
         * Chỉ chấp nhận các status code đã định nghĩa trong thư viện
         */
        if ((typeof err === 'string' || typeof err === 'number')
        && getDefaultErrorObject(`${err}` as HTTPError) !== undefined) return `${err}` as HTTPError;

        /**
         * Error Type 4: Error từ axios
         */
        const axiosErrorMap: Record<string, string> = { 'ECONNABORTED': INTERNAL_ERROR_ABORTED };
        const potentialAxiosErrorCode = axiosErrorMap[err?.code];
        if (potentialAxiosErrorCode) return potentialAxiosErrorCode as HTTPError;

        /** Default */
        return INTERNAL_ERROR_GENERIC_ERROR;
    } catch (e) {
        return INTERNAL_ERROR_GENERIC_ERROR;
    }
};

export const getHTTPError = <ServerErrorData extends Record<string, any> = {}>(
    err: any,
    HTTPErrorCodeExtractor: (err: any) => HTTPError = getHTTPErrorCode,
): ErrorObject => {
    /**
     * Nếu error truyền vào cũng là ErrorObject thì trả về nguyên vẹn
     */
    if (err?.__isErrorObject) return { ...err } as ErrorObject;
    /**
     * Nếu không có error thì trả về object rỗng để skip bước checking bên ngoài (không cần phải "?? {}")
     */
    if (err == null) return getDefaultErrorObject(INTERNAL_ERROR_NO_ERROR);
    let currentCode: HTTPError = INTERNAL_ERROR_GENERIC_ERROR;
    try {
        currentCode = HTTPErrorCodeExtractor(err);
        if (typeof currentCode !== 'string') throw new Error('CANNOT DETECT CODE');
    } catch(e) {
        currentCode = INTERNAL_ERROR_GENERIC_ERROR;
    }
    const errorObject = getDefaultErrorObject(currentCode);
    /**
     * errorObject sẽ được trộn thêm bộ ba code / message / detail từ server vào, vì server hiện tại có bộ ba mô tả riêng
     * với mỗi error, và đôi khi ta phải dùng bộ ba mô tả này thay cho bộ ba mô tả định nghĩa sẵn với các code lỗi trong
     * thư viện.
     * 
     * Nội dung lỗi đôi wrap bên ngoài với key response, nên ta sẽ thử lấy nó ra trước.
     * 
     * Nếu không tìm thấy thì copy nguyên văn nội dung với code lỗi tương ứng từ thư viện.
     */
    const serverErrorObject: ServerErrorData & { code: number, message: 'string' } = err?.response?.data
        ?? err?.data
        ?? err;

    /**
     * @todo Thống nhất chuẩn errorObject từ server để in lỗi
     */
    const { invariant_errors, missing_fields } = serverErrorObject ?? {};
    if (invariant_errors || missing_fields) {
        const normalizedInvariantErrorList: string[] = invariant_errors ?? [];
        const normalizedMissingFieldList: string[] = missing_fields ?? [];
        const invariantError = normalizedInvariantErrorList.length > 0
            ? normalizedInvariantErrorList.join(', ')
            : undefined;
        const missingError = normalizedMissingFieldList.length > 0
            ? `Need to provide: ${normalizedMissingFieldList.map(entry => entry.replace(/_+/g, ' ')).join(', ')}`
            : undefined;
        const message = [
            invariantError,
            missingError,
        ].filter(entry => entry !== undefined).join(' and ');
        const description = [
            invariantError ? 'Invalid value' : undefined,
            missingError ? 'Missing field' : undefined,
        ].filter(entry => entry !== undefined).join('. ');

        return {
            ...errorObject,
            preferReporterMessage: errorObject?.preferReporterMessage ?? true,
            preferFrontEndMessage: errorObject?.preferFrontEndMessage ?? false,
            preferReporterDescription: errorObject?.preferReporterDescription ?? true,
            preferFrontEndDescription: errorObject?.preferFrontEndDescription ?? false,
            serverCode: `${serverErrorObject?.code ?? errorObject.code}`,
            serverMessage: message,
            serverDescription: description,
            serverData: serverErrorObject,
            __isErrorObject: true,
        };
    }

    return {
        ...errorObject,
        preferReporterMessage: errorObject?.preferReporterMessage ?? true,
        preferFrontEndMessage: errorObject?.preferFrontEndMessage ?? false,
        preferReporterDescription: errorObject?.preferReporterDescription ?? true,
        preferFrontEndDescription: errorObject?.preferFrontEndDescription ?? false,
        serverCode: `${serverErrorObject?.code}`,
        serverMessage: serverErrorObject?.message,
        serverDescription: serverErrorObject?.details,
        serverData: serverErrorObject,
        __isErrorObject: true,
    };
};

export const isConsecutiveRequest = (err: any) => {
    return getHTTPErrorCode(err) === INTERNAL_EVENT_CONSECUTIVE_REQUEST;
};

export const isIntentionalCancel = (err: any) => {
    return getHTTPErrorCode(err) === INTERNAL_EVENT_INTENTIONAL_ABORTED;
};