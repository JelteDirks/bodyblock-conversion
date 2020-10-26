import {CellAddress, Range, WorkSheet} from "xlsx";
import * as xlsx from "xlsx";
import {ExcelController} from "./ExcelController";
import {cellInRange} from "./cellInRange";

export function sortByColumn(this: ExcelController, sheet: WorkSheet, column: string = 'regel template'): WorkSheet {

    this.setRefByContent();
    let ref = sheet["!ref"];

    if (!ref) throw 'sheet has no range';

    let originalSheetRange: Range = xlsx.utils.decode_range(ref);
    let sortColumnIndex: number = xlsx.utils.decode_col(this.findKeyForHeader(column));
    let maxColumn: number = xlsx.utils.decode_range(ref).e.c
    let indexingToLabelMap = new Map();

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

    return sheet;
}
