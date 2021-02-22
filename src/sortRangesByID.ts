import {Range} from "xlsx";

export interface RangeID {
    range: Range;
    id: string;
}

export function sortRangesByID(rangeList: RangeID[]): RangeID[] {

    const sorted = rangeList.sort((a: RangeID, b: RangeID) => {
        return a.id.localeCompare(b.id);
    });

    let r_current = 1;

    for (let rangeID of sorted) {
        const {range} = rangeID;
        const increment = range.e.r - range.s.r;

        range.s.r = r_current;
        range.e.r = r_current + increment;

        r_current = r_current + increment + 1;
    }

    return sorted;
}
