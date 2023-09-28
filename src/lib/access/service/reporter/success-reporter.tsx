import { notification } from 'antd';
import { customSuccessMessage, SuccessMessage } from './message';
import { ActionSuccessReportConfig } from 'lib/access/model/report';

export const actionSuccessReporter = (config: ActionSuccessReportConfig) => {
    const { target, action, type, description, message, duration, additionalConfig } = {
        type: 'notification' as ActionSuccessReportConfig['type'],
        ...config,
    };
    const reportMessage = message || action === undefined || target === undefined
        ? message
        : typeof SuccessMessage[action] === 'function'
            ? SuccessMessage[action](target)
            : customSuccessMessage(action, target);
    const notificationProps = {
        message: reportMessage,
        description,
        duration,
        ...additionalConfig,
    };

    switch (type) {
        case 'notification':
        case 'success':
            notification['success'](notificationProps);
            break;
        case 'error':
            notification['error'](notificationProps);
            break;
        case 'info':
            notification['info'](notificationProps);
            break;
        case 'warning':
            notification['warning'](notificationProps);
            break;
        default:
            console.log(`Success Reporter: ${reportMessage} \n${description ?? ''}`);
            break;
    }
};