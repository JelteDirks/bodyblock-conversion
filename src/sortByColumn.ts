import {CellAddress, Range, WorkSheet} from "xlsx";
import * as xlsx from "xlsx";
import {ExcelController} from "./ExcelController";
import {cellInRange} from "./cellInRange";
import {setCellOnPlain} from "./setCellOnPlain";
import {loopCellRange} from "./loopCellRange";

export function sortByColumn(this: ExcelController, sheet: WorkSheet, column: string = 'regel template'): WorkSheet {

    this.setRefByContent();
    let ref = sheet["!ref"];

    if (!ref) throw 'sheet has no range';

    let originalSheetRange: Range = xlsx.utils.decode_range(ref);
    let sortColumnIndex: number = xlsx.utils.decode_col(this.findKeyForHeader(column));
    let maxColumn: number = xlsx.utils.decode_range(ref).e.c
    let indexingToLabelMap: Map<string, Range> = new Map();

    let r = 1;

    while (cellInRange({r, c: sortColumnIndex}, originalSheetRange)) {
        const labelRange = this.identifyLabelRange(r);
        const sortColumnCellAddr: CellAddress = {r, c: sortColumnIndex};

        const cellValue = sheet[xlsx.utils.encode_cell(sortColumnCellAddr)].v;
        const rangeForIndexing = {
            s: {c: 0, r},
            e: {c: maxColumn, r: labelRange.e.r}
        };

        indexingToLabelMap.set(cellValue, rangeForIndexing);

        r = labelRange.e.r + 1;
    }

    const sorted = [...indexingToLabelMap.keys()].sort();
    const tmpSheet = {};

    let rngKey;
    while ((rngKey = sorted.shift()) !== undefined) {
        const rng: Range | undefined = indexingToLabelMap.get(rngKey);

        if (!rng) continue;

        let newRow = 1;
        let lastRow = rng.s.r;

        loopCellRange(rng, ((cellAddress: CellAddress) => {
            let {r: oldRow, c} = cellAddress;

            if ((oldRow - lastRow) === 1) {
                ++newRow;
            } else {
                lastRow = oldRow;
            }
            const cell = this.getCellByAddress(cellAddress);
            if (!cell) return;
            setCellOnPlain(xlsx.utils.encode_cell({r: newRow, c}), cell.v, tmpSheet);
        }), this);
    }

    return sheet;
}
