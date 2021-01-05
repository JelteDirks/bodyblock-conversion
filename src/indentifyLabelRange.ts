import {CellAddress, CellObject, Range, Sheet} from "xlsx";
import {findCellAddress} from "./findCellAddress";
import {cellInRange} from "./cellInRange";

const xlsx = require('xlsx');

export function identifyLabelRange(sheetObj: Sheet, startRow: number, columnName: string = 'omschrijving'): Range | undefined {
    const titleAddress: string[] = findCellAddress(sheetObj, columnName, xlsx.utils.decode_range('A1:I1'));

    if (titleAddress.length === 0) {
        throw 'no title address found for identifying label range';
    }

    const first: string = <string>titleAddress.pop();

    const c: number = xlsx.utils.decode_cell(first).c;

    let r: number = startRow;
    let value: string | undefined = '';

    const initialCellAddress: CellAddress = {r, c};
    const initialCellObject: CellObject = sheetObj[xlsx.utils.encode_cell(initialCellAddress)];
    const initialValue = initialCellObject.w;
    const maxColumn: number = xlsx.utils.decode_range(sheetObj["!ref"]).e.c;

    r = r + 1;

    while (!value && (value !== initialValue)) {
        const cellAddress: CellAddress = {r, c};
        const cellObject: CellObject = sheetObj[xlsx.utils.encode_cell(cellAddress)];

        if (!!cellObject) {
            value = String(cellObject.v);
        }

        if (!cellInRange(cellAddress, xlsx.utils.decode_range(sheetObj["!ref"]))) {
            return {s: {c, r: startRow}, e: {c: maxColumn, r: r - 1}};
        }

        r = r + 1;
    }

    return {s: {c, r: startRow}, e: {c: maxColumn, r: r - 2}};
}
