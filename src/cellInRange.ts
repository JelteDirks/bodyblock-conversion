import {CellAddress, Range} from "xlsx";

export function cellInRange(cell: CellAddress, range: Range) {
    return (cell.c >= range.s.c && cell.c <= range.e.c) &&
        (cell.r >= range.s.r && cell.r <= range.e.r);
}
