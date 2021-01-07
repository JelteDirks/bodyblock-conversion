import {CellAddress, Sheet} from "xlsx";
import {getLabelRangesWithID} from "./getLabelRangesWithID";
import {RangeID, sortRangesByID} from "./sortRangesByID";

export function sortBoy(sheetObj: Sheet,
                        columnForRange: string,
                        addressForSorting: CellAddress,
                        startRow: number): Sheet {
    const plain = {};
    const ranges = getLabelRangesWithID(sheetObj, columnForRange, addressForSorting, startRow);
    const sorted = sortRangesByID(ranges);
    // TODO: add ranges to sheet (make procedure for this)
    return sheetObj;
}
