import React from "react";
import { equals } from "ramda";
import { ErrorFeedback, ErrorWrapper } from "./error-feedback";

type ErrorBoundaryProps = {
    moduleName?: string,
} & ErrorFeedback;

type ErrorBoundaryState = {
    error?: Error,
    errorInfo?: React.ErrorInfo,
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    prevErrorInfo: React.ErrorInfo | undefined = undefined;
    prevError: any = undefined;
    state: Readonly<ErrorBoundaryState> = {
        error: undefined,
        errorInfo: undefined,
    };

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.setState({
            error,
            errorInfo,
        })
    }

    render(): React.ReactNode {
        const { error, errorInfo } = this.state;
        const { moduleName, children, ...wrapperProps } = this.props;

        const isRepeatedError = (error || errorInfo)
        && equals(error, this.prevError)
        && equals(errorInfo, this.prevErrorInfo);
        this.prevError = error;
        this.prevErrorInfo = errorInfo;

        if(isRepeatedError) {
            return <ErrorWrapper error={error} errorInfo={errorInfo} {...wrapperProps}/>
        }

        return <ErrorWrapper error={error} errorInfo={errorInfo} {...wrapperProps}>
            {children}
        </ErrorWrapper>
    }
}