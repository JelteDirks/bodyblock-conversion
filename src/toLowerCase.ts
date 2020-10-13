export function toLowerCase(value: string) {
    return String.prototype.toLowerCase.call(value);
}