import { ErrorBoundary } from "lib/access/error-panel/boundary";
import { ErrorWrapper } from "lib/access/error-panel/error-feedback";
import { equals } from "ramda";

export type AppBoundaryProps = {
    ErrorComponent?: React.ComponentType<{error: any, errorInfo: any}>,
}

export class AppBoundary extends ErrorBoundary {
    render(): React.ReactNode {
        const {error, errorInfo} = this.state;
        const {moduleName, children, ...wrapperprops} = this.props;

        const isRepeatedError = (error || errorInfo)
        && equals(error, this.prevError)
        && equals(errorInfo, this.prevErrorInfo);
        this.prevError = error;
        this.prevErrorInfo = errorInfo;

        if(isRepeatedError) {
            return <ErrorWrapper error={error} errorInfo={errorInfo}/>
        }

        return <ErrorWrapper error={error} errorInfo={errorInfo}>
            {children}
        </ErrorWrapper>
    }
}