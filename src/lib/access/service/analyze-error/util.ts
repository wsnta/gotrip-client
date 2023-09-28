export const getStackErrorOutput = (error: any) => {
    try {
        const messageStack = error?.stack?.toString()?.split('\n') ?? [];
        const analyzeStack = (str?: string) => {
            if (typeof str !== 'string') return '';

            const URLRegex = /https?:\/\/.*\//g;
            const stackRegex = / {4}at .* /gm;
            if (!stackRegex.test(str)) return str.replace(URLRegex, '');

            const locationRegex = / {4}at .* \((.*\/)[\w.:]*:\d*\)$/gm;
            const execResult: RegExpExecArray | null = locationRegex.exec(str);

            if (execResult !== null) {
                return str.replace(execResult[1], '').replace(URLRegex, '');
            } else return str.replace(URLRegex, '');
        };

        return [
            messageStack[0],
            analyzeStack(messageStack[1]),
            analyzeStack(messageStack[2]),
        ].join(' ').replace(/ +/g, ' ');
    } catch (e: any) {
        return 'Stack untracable';
    }
};