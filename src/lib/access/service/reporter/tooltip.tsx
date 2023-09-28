export const tooltipReporter = {
    checkPermission: (
        hasPermission?: boolean,
    ) => hasPermission === true
        ? undefined
        : 'No permission',
    checkReadonly: (
        isReadonly?: boolean,
    ) => isReadonly === true
        ? 'Could not change auto-generated item'
        : undefined,
};