import {Range, Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setRefByContent(sheetObj: Sheet) {
    const keys = Object.keys(sheetObj);
    let maxRow = -1;
    let maxCol = -1;

    for (let key of keys) {
        if (key.indexOf('!') > -1) continue;
        const address = xlsx.utils.decode_cell(key);
        maxRow = (maxRow < address.r) ? address.r : maxRow;
        maxCol = (maxCol < address.c) ? address.c : maxCol;
    }

    const newRef: Range = {s: {r: 0, c: 0}, e: {r: maxRow, c: maxCol}};

    sheetObj["!ref"] = xlsx.utils.encode_range(newRef);

    return sheetObj;
}
