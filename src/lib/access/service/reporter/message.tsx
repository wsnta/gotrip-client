const messageTemplate = (action: string, target: string, result: string) => {
    const normalizedAction = typeof action === 'string' && action.length > 0
        ? `${action[0].toUpperCase()}${action.slice(1, action.length)}`
        : '';

    return `${normalizedAction} ${target ? `${target} `: ''}${result}`;
};
const SupportedActionList = [
    'create',
    'update',
    'delete',
    'get',
    'submit',
    'save',
    'upload',
    'add',
    'remove',
];

export const ErrorMessage: Record<string, (target: string) => string> = SupportedActionList
    .reduce((prev, cur) => {
        prev[cur] = (target: string) => messageTemplate(cur, target, 'failed');

        return prev;
    }, {} as Record<string, (target: string) => string>);
export const customErrorMessage = (action: string, target: string) => {
    return messageTemplate(action, target, 'failed');
};

export const SuccessMessage: Record<string, (target: string) => string> = SupportedActionList
    .reduce((prev, cur) => {
        prev[cur] = (target: string) => messageTemplate(cur, target, 'successfully');

        return prev;
    }, {} as Record<string, (target: string) => string>);
export const customSuccessMessage = (action: string, target: string) => {
    return messageTemplate(action, target, 'successfully');
};