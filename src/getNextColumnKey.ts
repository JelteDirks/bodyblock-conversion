export function getNextColumnKey(key: string): string {
    if (key === 'Z' || key === 'z') {
        return String.fromCharCode(key.charCodeAt(0) - 25) + String.fromCharCode(key.charCodeAt(0) - 25); // AA or aa
    }

    let lastChar = key.slice(-1);
    let sub = key.slice(0, -1);
    if (lastChar === 'Z' || lastChar === 'z') {
        return getNextColumnKey(sub) + String.fromCharCode(lastChar.charCodeAt(0) - 25);
    }

    return sub + String.fromCharCode(lastChar.charCodeAt(0) + 1);
}