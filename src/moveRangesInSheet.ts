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

        // if this is the first iteration, the pointer should start and the start of the new range
        if (i === 0) {
            pointer = newR.s;
        }

        // set oldCellAddress to the first original start cell;
        let oldCellAddress: CellAddress = originalR.s;

        loopCellRange(originalR, (cellAddress => {
            // retrieve original value at this position
            let value = originalSheet[xlsx.utils.encode_cell(cellAddress)];

            // calculate position after sorting
            pointer.r = pointer.r + (cellAddress.r - oldCellAddress.r);
            pointer.c = cellAddress.c;

            // save the value at the new position in the sortedSheet
            sortedSheet[xlsx.utils.encode_cell(pointer)] = value;

            // update the old cell address
            oldCellAddress = cellAddress;
        }));
    }

    return Object.assign(originalSheet, sortedSheet);
}
