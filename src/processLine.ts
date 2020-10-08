export function processLine(line: string) {
    if (/[0-9]{2}\s.+/.test(line)) {
        console.log(line);
    }
}