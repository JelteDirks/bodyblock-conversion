import {CellAddress, Sheet} from "xlsx";
import {RangeConversion} from "./types";
import {loopCellRange} from "./loopCellRange";

const xlsx = require('xlsx');


export function moveRangesInSheet(originalSheet: Sheet, rangeConversions: RangeConversion[]): Sheet {
    const sortedSheet: { [key: string]: any } = {};

    let pointer: CellAddress = {r: 0, c: 0};

    for (let i = 0; i < rangeConversions.length; ++i) {
        // extract local ranges
        let originalR = rangeConversions[i].originalRange;
        let newR = rangeConversions[i].newRange;

        // pointer should be initialized at the start of the new range
        pointer = newR.s;

        // set oldCellAddress to the first original start cell;
        let oldCellAddress: CellAddress = originalR.s;

        loopCellRange(originalR, (cellAddress => {
            // retrieve original value at this position
            let cell = originalSheet[xlsx.utils.encode_cell(cellAddress)];

            // calculate position after sorting
            pointer.r = pointer.r + (cellAddress.r - oldCellAddress.r);
            pointer.c = cellAddress.c;

            // save the value at the new position in the sortedSheet
            sortedSheet[xlsx.utils.encode_cell(pointer)] = cell;

            // update the old cell address
            oldCellAddress = cellAddress;
        }));
    }

    return Object.assign(originalSheet, sortedSheet);
}
