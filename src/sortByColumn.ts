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
    let labelRangeMap: Map<string, Range> = new Map();

    let r = 1;

    while (cellInRange({r, c: sortColumnIndex}, originalSheetRange)) {
        const labelRange = this.identifyLabelRange(r);
        const sortColumnCellAddr: CellAddress = {r, c: sortColumnIndex};

        const cellValue = sheet[xlsx.utils.encode_cell(sortColumnCellAddr)].v;
        const rangeForIndexing = {
            s: {c: 0, r},
            e: {c: maxColumn, r: labelRange.e.r}
        };

        labelRangeMap.set(cellValue, rangeForIndexing);

        r = labelRange.e.r + 1;
    }

    let tmpSheet = {};

    const sorted = [...labelRangeMap.keys()].sort();

    sorted.map((rngKey: string) => {
        const rng: Range = <Range>labelRangeMap.get(rngKey);

        loopCellRange(rng, ((cellAddress: CellAddress) => {

            const cell = this.getCellByAddress(cellAddress);


        }), this);
    });

    console.log(tmpSheet);

    console.log('-----');

    return sheet;
}
