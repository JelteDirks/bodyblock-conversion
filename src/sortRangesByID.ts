import {Range} from "xlsx";

import {cloneDeep} from "lodash";

export interface RangeID {
    range: Range;
    id: string;
}

export function sortRangesByID(rangeList: RangeID[]): { sorted: RangeID[], original: RangeID[] } {

    const original = cloneDeep(rangeList);
    const sorted = cloneDeep(rangeList)

    sorted.sort((a: RangeID, b: RangeID) => {
        return a.id.localeCompare(b.id);
    });

    let r_current = 1;

    for (let i = 0; i < sorted.length; ++i) {
        const increment = sorted[i].range.e.r - sorted[i].range.s.r;

        sorted[i].range.s.r = r_current;
        sorted[i].range.e.r = r_current + increment;

        r_current = r_current + increment + 1;
    }

    return {sorted, original};
}
