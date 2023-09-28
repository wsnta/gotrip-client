import { notification } from 'antd';
import { getHTTPError } from '../analyze-error';
import { customErrorMessage, ErrorMessage } from './message';
import { ActionErrorReportConfig, ErrorReporterConfig } from 'lib/access/model/report';

const UniqueErrorMap: Record<string, boolean> = {};
export const errorReporter = (e: any, config?: ErrorReporterConfig) => {
    const {
        strictMode: forcedStrictMode,
        type: forcedType,
        message: forcedMessage,
        description: forcedDescription,
        duration: forcedDuration,
        unique: forcedUnique,
        preferFrontEndDescription: forcedPreferFrontEndDescription,
        preferFrontEndMessage: forcedPreferFrontEndMessage,
        preferReporterDescription: forcedPreferReporterDescription,
        preferReporterMessage: forcedPreferReporterMessage,
        useBackEndMessageAsDescription: forcedUseBackEndMessageAsDescription,
    } = config ?? {};
    const analyzedError = getHTTPError(e);
    const {
        type: errorType,
        code,
        messageComponent,
        serverMessage: serverErrorMessage,
        descriptionComponent,
        serverDescription: serverErrorDescription,
    } = analyzedError;
    const preferFrontEndMessage = forcedPreferFrontEndMessage ?? analyzedError.preferFrontEndMessage;
    const preferReporterMessage = forcedPreferReporterMessage ?? analyzedError.preferReporterMessage;
    const preferFrontEndDescription = forcedPreferFrontEndDescription
        ?? analyzedError.preferFrontEndDescription
        ?? analyzedError.preferFrontEndMessage;
    const preferReporterDescription = forcedPreferReporterDescription
        ?? analyzedError.preferReporterDescription
        ?? analyzedError.preferReporterMessage;
    const useBackEndMessageAsDescription = forcedUseBackEndMessageAsDescription ?? analyzedError.useBackEndMessageAsDescription;
    const analyzedMessage = preferFrontEndMessage
        ? analyzedError.message
        : serverErrorMessage;
    const analyzedDescription = preferFrontEndDescription
        ? analyzedError.description
        : useBackEndMessageAsDescription
            ? serverErrorMessage
            : serverErrorDescription;
    const errorReportBundle: ErrorReporterConfig = {
        strictMode: forcedStrictMode ?? true,
        type: forcedType ?? 'notification',
        message: preferReporterMessage
            ? forcedMessage ?? analyzedMessage
            : analyzedMessage,
        description: preferReporterDescription
            ? forcedDescription ?? analyzedDescription
            : analyzedDescription,
        duration: forcedDuration ?? analyzedError.duration,
        unique: forcedUnique ?? analyzedError.unique,
    };
    /** Strict mode: Only explicit errors get treated, info and success are ignored */
    const {
        strictMode,
        type,
        message,
        description,
        duration,
        unique,
    } = errorReportBundle;
    
    if (strictMode && (errorType === 'success' || errorType === 'info')) return errorReportBundle;
    
    switch (type) {
        case 'notification': {
            if (unique !== true || UniqueErrorMap[code] !== true) {
                const normalizedMessage = preferFrontEndMessage && messageComponent
                    ? messageComponent(errorReportBundle)
                    : message;
                if (normalizedMessage) notification[errorType ?? 'error']({
                    message: normalizedMessage,
                    description: preferFrontEndMessage && descriptionComponent
                        ? descriptionComponent(errorReportBundle)
                        : description,
                    duration,
                    key: unique ? code : undefined,
                });
            }
            if (unique && code) UniqueErrorMap[code] = true;
            break;
        }
        case 'throw':
            throw new Error(`${message}: ${description}`);
        default:
            console.error(`Error Reporter: ${message} \n${description} \n${e?.stack ?? ''}`);
            break;
    }
    return errorReportBundle;
};

const defaultActionErrorReporter: Partial<ActionErrorReportConfig> = {
    strictMode: false,
    type: 'notification',
};
export const actionErrorReporter = (e: any, config?: ActionErrorReportConfig) => {
    const {
        target,
        action,
        type,
        strictMode,
        description,
        message,
        duration,
        additionalConfig,
        ...rest
    } = { ...defaultActionErrorReporter, ...config };
    const reportMessage = message || action === undefined || target === undefined
        ? message
        : typeof ErrorMessage[action] === 'function'
            ? ErrorMessage[action](target)
            : customErrorMessage(action, target);

    return errorReporter(e, { 
        type, 
        message: reportMessage, 
        description,
        strictMode,
        duration,
        ...additionalConfig,
        ...rest,
    });
};
