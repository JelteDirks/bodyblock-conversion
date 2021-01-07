import {CellAddress, Range} from "xlsx";

export function loopCellRange(range: Range, cb: (cellAddress: CellAddress) => any, _this: any = null) {
    for (let r = range.s.r; r <= range.e.r; ++r) {
        for (let c = range.s.c; c <= range.e.c; ++c) {
            cb.call(_this, {r, c});
        }
    }
}
