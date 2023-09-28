import React from "react";
import { ErrorReportConfig } from "./report";

export const INTERNAL_ERROR_GENERIC_ERROR = '000' as const;
export const INTERNAL_ERROR_UNAUTHORIZED = '001' as const;
export const INTERNAL_ERROR_ABORTED = '002' as const;
export const INTERNAL_EVENT_CONSECUTIVE_REQUEST = '004' as const;
export const INTERNAL_EVENT_INTENTIONAL_ABORTED = '005' as const;
export const INTERNAL_ERROR_NO_ERROR = '006' as const;

export type ErrorObject = {
    // Để analzyer phân biệt với các object lỗi khác
    __isErrorObject?: boolean,
    // Type từ notication của antd
    type?: 'success' | 'info' | 'warning' | 'error'
    code: string,
    message: string,
    messageComponent?: (config: ErrorReportConfig) => React.ReactNode,
    description?: string,
    descriptionComponent?: (config: ErrorReportConfig) => React.ReactNode,
    duration?: number,
    preferFrontEndMessage?: boolean,
    preferFrontEndDescription?: boolean,
    preferReporterMessage?: boolean,
    preferReporterDescription?: boolean,
    useBackEndMessageAsDescription?: boolean,
    soft?: boolean,
    // Unique error  sẽ không trigger thông báo 2 lần từ notification
    unique?: boolean,
    // Thông tin từ định nghĩa của server
    serverCode?: string,
    serverMessage?: string,
    serverDescription?: string,
    serverData?: Record<string, any>,
    output?: string,
}

export type ErrorObjectMap = Record<string, ErrorObject>;

export const getBaseErrorObject = () => ({
    __isErrorObject: true,
    code: INTERNAL_ERROR_GENERIC_ERROR,
    type: 'error',
    message: 'Error',
    description: 'Please try again',
} as ErrorObject);

export const BaseErrorMap: Record<string, Partial<ErrorObject>> = {
    [INTERNAL_ERROR_GENERIC_ERROR]: {
        message: 'Module has stopped working',
        description: 'This module has encountered a problem and couldn\'t recover',
    },
    [INTERNAL_ERROR_UNAUTHORIZED]: {
        message: 'User is not authenticated',
        description: 'Please ensure that you have logged in our platform.',
        duration: 0,
        unique: true,
    },
    [INTERNAL_ERROR_ABORTED]: {
        message: 'Request took too long',
    },
    [INTERNAL_EVENT_CONSECUTIVE_REQUEST]: {
        type: 'info',
        message: 'Consecutive requests detected',
        description: 'Please wait until the lastest request is complete',
    },
    [INTERNAL_EVENT_INTENTIONAL_ABORTED]: {
        type: 'info',
        message: 'Intentional cancel',
        description: 'This request is cancelled per user command',
    },
    [INTERNAL_ERROR_NO_ERROR]: {
        message: '',
        description: '',
        preferReporterMessage: true,
    },
    '100': {
        type: 'info',
        message: 'Continue',
    },
    '101': {
        type: 'info',
        message: 'Switching Protocols',
    },
    '102': {
        type: 'info',
        message: 'Processing',
    },
    '200': {
        type: 'success',
        message: 'OK',
    },
    '201': {
        type: 'success',
        message: 'Created',
    },
    '202': {
        type: 'success',
        message: 'Accepted',
    },
    '203': {
        type: 'success',
        message: 'Non-authoritative Information',
    },
    '204': {
        type: 'success',
        message: 'No Content',
    },
    '205': {
        type: 'success',
        message: 'Reset Content',
    },
    '206': {
        type: 'success',
        message: 'Partial Content',
    },
    '207': {
        type: 'success',
        message: 'Multi-Status',
    },
    '208': {
        type: 'success',
        message: 'Already Reported',
    },
    '226': {
        type: 'success',
        message: 'IM Used',
    },
    '300': {
        type: 'warning',
        message: 'Multiple Choices',
    },
    '301': {
        type: 'warning',
        message: 'Moved Permanently',
    },
    '302': {
        type: 'warning',
        message: 'Found',
    },
    '303': {
        type: 'warning',
        message: 'See Other',
    },
    '304': {
        type: 'warning',
        message: 'Not Modified',
    },
    '305': {
        type: 'warning',
        message: 'Use Proxy',
    },
    '307': {
        type: 'warning',
        message: 'Temporary Redirect',
    },
    '308': {
        type: 'warning',
        message: 'Permanent Redirect',
    },
    '400': {
        message: 'Request is Rejected',
        description: 'Server rejected your request because of missing or invalid data',
    },
    '401': {
        type: 'warning',
        message: 'User is not authenticated',
        description: 'Your session has been expired. Please log in and refresh the page',
        duration: 0,
        preferFrontEndMessage: true,
        preferReporterMessage: false,
        unique: true,
    },
    '402': { message: 'Payment Required' },
    '403': {
        message: 'Request is Forbidden',
        description: 'You are not allowed to perform this operation',
        preferFrontEndMessage: true,
        useBackEndMessageAsDescription: true,
        soft: true,
    },
    '404': {
        message: 'Request Not Found',
        description: 'Badly formed data or outdated request',
    },
    '405': { message: 'Method Not Allowed' },
    '406': {
        message: 'Data Not Found',
        description: 'Non-existent or deleted data',
        soft: true,
    },
    '407': { message: 'Proxy Authentication Required' },
    '408': {
        message: 'Request Timeout',
        description: 'Your request took too long to response',
    },
    '409': { message: 'Conflict' },
    '410': { message: 'Gone' },
    '411': { message: 'Length Required' },
    '412': {
        message: 'Precondition Failed',
        preferFrontEndMessage: false,
    },
    '413': { message: 'Payload Too Large' },
    '414': { message: 'Request-URI Too Long' },
    '415': { message: 'Unsupported Media Type' },
    '416': { message: 'Requested Range Not Satisfiable' },
    '417': { message: 'Expectation Failed' },
    '418': { message: 'I\'m a teapot' },
    '421': { message: 'Misdirected Request' },
    '422': {
        message: 'Unprocessable Data',
        description: 'Server detected unsuitable or duplicated data in your request',
    },
    '423': { message: 'Locked' },
    '424': { message: 'Failed Dependency' },
    '426': { message: 'Upgrade Required' },
    '428': { message: 'Precondition Required' },
    '429': { message: 'Too Many Requests' },
    '431': { message: 'Request Header Fields Too Large' },
    '444': { message: 'Connection Closed Without Response' },
    '451': { message: 'Unavailable For Legal Reasons' },
    '499': { message: 'Client Closed Request' },
    '500': {
        message: 'Server Error',
        description: 'The server could not complete your request. Please try again later.',
    },
    '501': { message: 'Not Implemented' },
    '502': {
        message: 'Could not connect to server',
        description: 'Server is temporarily unavailable',
        preferFrontEndMessage: true,
        preferReporterMessage: false,
    },
    '503': {
        message: 'Service Unavailable',
        description: 'Server could not answer your request right now',
    },
    '504': { message: 'Gateway Timeout' },
    '505': { message: 'HTTP Version Not Supported' },
    '506': { message: 'Variant Also Negotiates' },
    '507': { message: 'Insufficient Storage' },
    '508': { message: 'Loop Detected' },
    '510': { message: 'Not Extended' },
    '511': { message: 'Network Authentication Required' },
    '599': { message: 'Network Connect Timeout Error' },
};

export type HTTPError = typeof INTERNAL_ERROR_GENERIC_ERROR
    | typeof INTERNAL_ERROR_UNAUTHORIZED
    | typeof INTERNAL_ERROR_ABORTED
    | typeof INTERNAL_EVENT_CONSECUTIVE_REQUEST
    | typeof INTERNAL_EVENT_INTENTIONAL_ABORTED
    | typeof INTERNAL_ERROR_NO_ERROR
    | '100' | '101' | '102'
    | '200' | '201' | '202' | '203' | '204' | '205' | '206' | '207' | '208' | '226'
    | '300' | '301' | '302' | '303' | '304' | '305' | '307' | '308'
    | '400' | '401' | '402' | '403' | '404' | '405' | '406' | '407' | '408' | '409' | '410'
    | '411' | '412' | '413' | '414' | '415' | '416' | '417' | '418' | '421' | '422' | '423' | '424' | '426' | '428' | '429'
    | '431' | '444' | '451' | '499'
    | '500' | '501' | '502' | '503' | '504' | '505' | '506' | '507' | '508' | '510' | '511' | '599';

export const DefaultErrorObjectMap = (base => {
    const result: Record<any, any> = {};
    Object
        .entries(base)
        .forEach(([key, value]) => {
            result[key] = {
                ...getBaseErrorObject(),
                code: key,
                ...value,
            } as ErrorObject;
        });
    return result as Record<HTTPError, ErrorObject>;
})(BaseErrorMap);

export const getDefaultErrorObject = (code: HTTPError) => {
    if (DefaultErrorObjectMap[code]) return { ...DefaultErrorObjectMap[code] };
    return { ...DefaultErrorObjectMap[INTERNAL_ERROR_GENERIC_ERROR] };
};