import {CellAddress, Sheet} from "xlsx";
import {getLabelRangesWithID} from "./getLabelRangesWithID";
import {RangeID, sortRangesByID} from "./sortRangesByID";
import {RangeConversion} from "./types";
import {createRangeConversion} from "./createRangeConversion";
import {moveRangesInSheet} from "./moveRangesInSheet";

export function sortBoy(sheetObj: Sheet,
                        columnForRange: string,
                        addressForSorting: CellAddress,
                        startRow: number): Sheet {

    const rangesWithID: RangeID[] = getLabelRangesWithID(sheetObj, columnForRange, addressForSorting, startRow);
    const {sorted, original} = <{ original: RangeID[], sorted: RangeID[] }>sortRangesByID(rangesWithID);
    const rangeconversions: RangeConversion[] = createRangeConversion(original, sorted);
    const converted: Sheet = moveRangesInSheet(sheetObj, rangeconversions);

    return converted;
}
