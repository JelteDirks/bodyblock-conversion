export function excelColumnNameSort(arr: string[]) {
    return arr.sort(function (a: string, b: string) {
        if (a.length > b.length) return 1;
        if (b.length > a.length) return -1;
        return a.localeCompare(b);
    });
}
