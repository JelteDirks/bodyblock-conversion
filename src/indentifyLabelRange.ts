import {CellAddress, CellObject, Range, Sheet} from "xlsx";
import {cellInRange} from "./cellInRange";

const xlsx = require('xlsx');

export function identifyLabelRange(sheetObj: Sheet, startRow: number, columnForSorting: string): Range | undefined {

    const c: number = xlsx.utils.decode_col(columnForSorting);

    let r: number = startRow;
    let value: string | undefined = '';

    const initialCellObject: CellObject = sheetObj[xlsx.utils.encode_cell({r, c})];
    const initialValue = initialCellObject.w;
    const maxColumn: number = xlsx.utils.decode_range(sheetObj["!ref"]).e.c;
    const minColumn: number = xlsx.utils.decode_range(sheetObj["!ref"]).s.c;

    r = r + 1;

    while (!value && (value !== initialValue)) {
        const cellAddress: CellAddress = {r, c};
        const cellObject: CellObject = sheetObj[xlsx.utils.encode_cell(cellAddress)];

        if (!!cellObject) {
            value = String(cellObject.v);
        }

        if (!cellInRange(cellAddress, xlsx.utils.decode_range(sheetObj["!ref"]))) {
            return {s: {c: minColumn, r: startRow}, e: {c: maxColumn, r: r - 1}};
        }

        r = r + 1;
    }

    return {s: {c: minColumn, r: startRow}, e: {c: maxColumn, r: r - 2}};
}
