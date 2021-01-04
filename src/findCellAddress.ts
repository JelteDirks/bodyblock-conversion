import {CellAddress, CellObject, Range, Sheet} from "xlsx";
import {cellInRange} from "./cellInRange";

const xlsx = require('xlsx');

export function findCellAddress(sheetObject: Sheet, content: string, range?: Range): string[] {
    const ref: string | undefined = sheetObject["!ref"]

    if (!ref) {
        throw 'ref is undefined';
    }

    const refRange = xlsx.utils.decode_range(ref);
    const cellsFound = [];

    for (let r = refRange.s.r; r <= refRange.e.r; ++r) {
        for (let c = refRange.s.c; c <= refRange.e.c; ++c) {

            const address: CellAddress = {r, c};
            const cell: string = xlsx.utils.encode_cell(address);

            if (cellInRange(address, range || refRange)) {
                const cellObject: CellObject = sheetObject[cell];

                if (!cellObject) continue;

                if (cellObject.v === content) {
                    cellsFound.push(cell);
                }
            }
        }
    }

    return cellsFound;
}
