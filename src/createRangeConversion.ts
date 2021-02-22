import {RangeID} from "./sortRangesByID";
import {RangeConversion} from "./types";

export function createRangeConversion(originalRangesOrder: RangeID[], sortedRangesOrder: RangeID[]): RangeConversion[] {

    const result: RangeConversion[] = [];

    for (let i = 0; i < originalRangesOrder.length; ++i) {

        let ogID = originalRangesOrder[i].id;

        for (let j = 0; j < sortedRangesOrder.length; ++j) {
            if (!sortedRangesOrder[j]) continue;

            let soID = sortedRangesOrder[j].id;

            if (ogID === soID) {
                result.push({
                    originalRange: originalRangesOrder[i].range,
                    newRange: sortedRangesOrder[j].range
                });

                delete sortedRangesOrder[j];
                break;
            }
        }
    }

    return result;
}
