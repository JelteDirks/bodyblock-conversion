import {RangeID} from "./sortRangesByID";
import {RangeConversion} from "./types";

export function createRangeConversion(originalRangesOrder: RangeID[], sortedRangesOrder: (RangeID | null)[]): RangeConversion[] {

    const result: RangeConversion[] = [];

    for (let i = 0; i < originalRangesOrder.length; ++i) {
        for (let j = 0; j < sortedRangesOrder.length; ++j) {
            if (sortedRangesOrder[j] === null) continue;

            let obj = <RangeID>sortedRangesOrder[j];

            if (originalRangesOrder[i].id === obj.id) {
                result.push({
                    originalRange: originalRangesOrder[i].range,
                    newRange: obj.range
                });

                sortedRangesOrder[j] = null;
                break;
            }
        }
    }

    return result;
}
