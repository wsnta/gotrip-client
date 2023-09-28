import { ErrorObject } from './http-error'

export type ActionMessage = 'create' | 'upadte' | 'delete' | 'get' | 'submit' | 'save' | 'upload' | 'add' | 'remove';

export type ErrorReportType = 'log' | 'throw' | 'notification';

export type ActionErrorMessage = ActionMessage;

export type ActionErrorReportConfig = {
    target?: string,
    action?: ActionErrorMessage,
    type?: ErrorReportType,
    description?: React.ReactNode,
    strictMode?: boolean,
    message?: React.ReactNode,
    duration?: number,
    additionalConfig?: Record<string, any>,
} & Pick<ErrorObject, 'duration'
| 'unique'
| 'preferFrontEndDescription'
| 'preferFrontEndMessage'
| 'preferReporterMessage'
| 'preferReporterDescription'
| 'useBackEndMessageAsDescription'> | {
    target?: string,
    action?: string,
    type?: ErrorReportType,
    description?: React.ReactNode,
    strictMode?: boolean,
    message?: React.ReactNode,
    duration?: number,
    additionalConfig?: Record<string, any>,
} & Pick<ErrorObject, 'duration'
| 'unique'
| 'preferFrontEndDescription'
| 'preferFrontEndMessage'
| 'preferReporterMessage'
| 'preferReporterDescription'
| 'useBackEndMessageAsDescription'>;

export type ErrorReportConfig = {
    type?: ErrorReportType,
    message?: React.ReactNode,
    description?: React.ReactNode | (() => React.ReactNode),
    strictMode?: boolean,
} & Pick<ErrorObject, 'duration'
| 'unique'
| 'preferFrontEndDescription'
| 'preferFrontEndMessage'
| 'preferReporterMessage'
| 'preferReporterDescription'
| 'useBackEndMessageAsDescription'>;

export type ErrorReporterConfig = {
    type?: ErrorReportType,
    message?: React.ReactNode,
    description?: React.ReactNode | (() => React.ReactNode) | any,
    strictMode?: boolean,
} & Pick<ErrorObject, 'duration'
| 'unique'
| 'preferFrontEndDescription'
| 'preferFrontEndMessage'
| 'preferReporterDescription'
| 'preferReporterMessage'
| 'useBackEndMessageAsDescription'>;

export type ActionSuccessReportType = 'log' | 'notification' | 'error' | 'success' | 'info' | 'warning';

export type ActionSuccessMessage = ActionMessage;

export type ActionSuccessReportConfig = {
    target?: string,
    action?: ActionSuccessMessage,
    type?: ActionSuccessReportType,
    description?: React.ReactNode,
    duration?: number,
    message?: string
    additionalConfig?: Record<string, any>,
} | {
    target?: string,
    action?: string,
    type?: ActionSuccessReportType,
    description?: React.ReactNode,
    duration?: number,
    message?: string
    additionalConfig?: Record<string, any>,
}