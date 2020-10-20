import * as xlsx from "xlsx";
import {Range} from "xlsx";

export function loopCellRange(range: Range, cb: (cellReference: string) => any, _this: any = null) {
    for (let row = range.s.r; row <= range.e.r; ++row) {
        for (let col = range.s.c; row <= range.e.c; ++col) {
            const address = {r: row, c: col};
            const ref = xlsx.utils.encode_cell(address);
            cb.call(_this, ref);
        }
    }
}
