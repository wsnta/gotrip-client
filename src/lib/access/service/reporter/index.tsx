import { actionSuccessReporter } from './success-reporter';
import { actionErrorReporter } from './error-reporter';

export const actionReporter = {
    success: actionSuccessReporter,
    error: actionErrorReporter,
};

export {
    errorReporter,
    actionErrorReporter,
} from './error-reporter';
export { actionSuccessReporter } from './success-reporter';
export {
    ErrorMessage,
} from './message';
export {
    tooltipReporter,
} from './tooltip';