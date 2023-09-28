import React from "react";
import { ErrorObject, ErrorObjectMap, INTERNAL_ERROR_GENERIC_ERROR, getBaseErrorObject } from "../model/http-error";
import styled from "styled-components";
import { getStackErrorOutput } from "../service/util";

const ErrorWrapperContainer = styled.div`
    padding: var(--spacing-sm);
    color: var(--color-subtle);
    background-color: white;
    text-align: center;
    &.error-wrapper-error {
        .message {
            color: var(--main-danger);
        }
    }
    &.error-wrapper-info {
        .message {
            color: var(--main-major);
        }
    }
    .message {
        font-weight: bold;
        font-size: var(--fs-lg);
    }
    .description {
        margin: var(--spacing-sm);
        margin-top: 0;
    }
    .output {
        background-color: var(--main-tertiaryLighter);
        border-radius: var(--br);
        border: var(--bd);
        display: inline-block;
        line-height: var(--lh-lg);
        padding: var(--spacing-xxs);
        white-space: pre-wrap;
        font-family: monospace;
        font-size: var(--fs-sm);
        margin-top: var(--spacing-xxs);
        word-break: break-word;
        max-width: 60%;
    }
`;

export type ErrorFeedbackShell = {
    error?: Error,
    errorInfo?: React.ErrorInfo
} & ErrorObject

export type ErrorFeedback = {
    error?: any,
    errorInfo?: React.ErrorInfo,
    errorPropsMap?: ErrorObjectMap,
    codeExtractor?: (e: any) => string,
    hideOutput?: boolean,
    ErrorComp?: React.ComponentType<ErrorFeedbackShell>,
    children?: React.ReactNode,
}

export const DefaultErrorFeedbackShell = (props: ErrorFeedbackShell) => {
    const { message, description, type, output } = props;

    return <ErrorWrapperContainer
        {...props}
        className={`error-wrapper error-wrapper-${type}`}
        style={{ height: '100%' }}
    >
        <div className="message">{message}</div>
        <div className="description">
            {description}
        </div>
        {
            (typeof output === 'string' && output.trim().length > 0)
            && <div>
                You may also report this log to the Administrator <br />
                <div className="output">{output}</div>
            </div>
        }
    </ErrorWrapperContainer>
}

const getHTTPErrorCode = (error: any) => {
    return 'HTTP ERROR'
}

const errorFeedbackGenerator = (Component: React.ComponentType<{
    ErrorComp: React.ComponentType<ErrorFeedbackShell>,
} & Pick<ErrorFeedback, 'error' | 'errorInfo' | 'children'> & ErrorObject>) => {
    return ({
        error,
        errorInfo,
        errorPropsMap,
        codeExtractor,
        ErrorComp = DefaultErrorFeedbackShell,
        children = '',
        hideOutput,
    }: ErrorFeedback) => {
        const internalCodeExtractor = codeExtractor ?? getHTTPErrorCode;
        let currentCode: string = INTERNAL_ERROR_GENERIC_ERROR;

        try {
            currentCode = `${internalCodeExtractor(error)}`
        } catch (e) { }

        const errorMap: (typeof errorPropsMap) = {
            ...errorPropsMap
        };

        const props = {
            ...getBaseErrorObject,
            ...(errorMap[currentCode] ?? errorMap[INTERNAL_ERROR_GENERIC_ERROR]),
            output: hideOutput ? '' : getStackErrorOutput(error),
        };

        return <>
            {
                error || errorInfo
                    ? <Component error={error} {...props} ErrorComp={ErrorComp} />
                    : children
            }
        </>
    }
}

export const ErrorWrapper = errorFeedbackGenerator(({
    error,
    errorInfo,
    ErrorComp,
    children,
    ...props
}) => {
    return <>
        {
            error || errorInfo
                ? <ErrorComp error={error} {...props} />
                : children
        }
    </>
})