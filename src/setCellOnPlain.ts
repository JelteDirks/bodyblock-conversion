import * as xlsx from "xlsx";

export function setCellOnPlain(r: number, c: number, value: any, obj: { [key: string]: any }) {
    if (!value) {
        value = '';
    }

    const key = xlsx.utils.encode_cell({r, c});

    return Object.assign(obj, {
        [key]: {
            v: value
        }
    });
}
