import {CellAddress, CellObject, Sheet} from "xlsx";
import {RangeID} from "./sortRangesByID";
import {identifyLabelRange} from "./indentifyLabelRange";

const xlsx = require('xlsx');

export function getLabelRangesWithID(sheetObj: Sheet,
                                     identifyingColumn: string,
                                     relativeIDAddress: CellAddress): RangeID[] {
    let r = 0;
    const ranges: RangeID[] = [];

    while (r <= xlsx.utils.decode_range(sheetObj["!ref"]).e.r) {
        let range = identifyLabelRange(sheetObj, r, 'A');
        let rID = range.s.r + relativeIDAddress.r;
        let cID = range.s.c + relativeIDAddress.c;
        let cellID: CellObject = sheetObj[xlsx.utils.encode_cell({r: rID, c: cID})];
        let valueID = cellID.v;
        ranges.push({id: String(valueID), range})
        r = range.e.r + 1;
    }

    return ranges;
}
