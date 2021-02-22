import {CellAddress, Sheet} from "xlsx";
import {getLabelRangesWithID} from "./getLabelRangesWithID";
import {RangeID, sortRangesByID} from "./sortRangesByID";
import {RangeConversion} from "./types";
import {createRangeConversion} from "./createRangeConversion";

export function sortBoy(sheetObj: Sheet,
                        columnForRange: string,
                        addressForSorting: CellAddress,
                        startRow: number): Sheet {
    const plain = {};
    const rangesWithID: RangeID[] = getLabelRangesWithID(sheetObj, columnForRange, addressForSorting, startRow);
    const sortedRangesWithID: RangeID[] = sortRangesByID(rangesWithID);
    const rangeconversions: RangeConversion[] = createRangeConversion(rangesWithID, sortedRangesWithID);

    // TODO: add ranges to sheet (make procedure for this)


    return sheetObj;
}
