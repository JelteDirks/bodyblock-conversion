export function setCellOnPlain(key: string, value: any, obj: {[key: string]: any}) {
    return Object.assign(obj, {
        [key]: {
            v: value
        }
    });
}