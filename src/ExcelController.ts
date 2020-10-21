import path from "path";
import {CellAddress, CellObject, Range, WorkBook, WorkSheet} from "xlsx";
import {Polis} from "./Polis";
import {Regel} from "./Regel";
import {toLowerCase} from "./toLowerCase";
import {compareInhoud} from "./compareInhoud";
import {cellInRange} from "./cellInRange";
import {loopCellRange} from "./loopCellRange";
import {addLabelToSheet} from "./addLabelToSheet";

const xlsx = require('xlsx');

export class ExcelController {

    readonly workbook: WorkBook;
    static defaultHeaders: { [key: string]: any } = {
        A1: 'omschrijving',
        B1: 'inhoud',
        C1: 'weergave',
        D1: 'uitlijnen',
        E1: 'regel verwijderen',
        F1: 'regel template'
    }
    headers: { [key: string]: any } = {...ExcelController.defaultHeaders};
    maatschappijColumn: number = -1; // 0-index number for maatschappij column
    maxRow: number = -1; // 0-indexed number for max row in sheet
    maxColumn: number = -1; // 0-indexed number for max column in sheet
    polis: Polis;

    constructor(file: string, polis: Polis) {

        this.workbook = xlsx.readFile(path.resolve(file));
        const sheets = this.workbook.Sheets;

        if (!sheets.hasOwnProperty(polis.branche)) {
            xlsx.utils.book_append_sheet(this.workbook, xlsx.utils.aoa_to_sheet([
                this.getHeadersAsArray()
            ]), polis.branche);
        }

        this.polis = polis;
        this.setMaxRow();
        this.setMaxColumn()
        this.setMaatschappijColumn();
    }

    setCellByAddress(address: CellAddress, value: any) {
        if (cellInRange(address, xlsx.utils.decode_range(this.getSheet()["!ref"]))) {
            this.getCellByAddress(address).v = value;
            return;
        }

        const newKey = xlsx.utils.encode_cell(address);
        this.workbook.Sheets[this.polis.branche][newKey] = {};
        this.getCellByAddress(address).v = value;
    }

    setCellByKey(key: string, value: any) {

        if (this.cellExists(key)) {
            this.getCellByKey(key).v = value;
            return
        }

        this.workbook.Sheets[this.polis.branche][key] = {};
        this.getCellByKey(key).v = value;
    }

    getCellByAddress(address: CellAddress) {
        return this.getSheet()[xlsx.utils.encode_cell(address)];
    }

    getCellByKey(key: string): CellObject {
        return this.getSheet()[key];
    }

    cellExists(key: string | CellAddress): boolean {
        if (typeof key === 'string') return !!this.getCellByKey(key);
        return !!this.getCellByAddress(key);
    }

    getHeadersAsArray(): string[] {
        return Object.keys(ExcelController.defaultHeaders).map((e: string) => {
            return ExcelController.defaultHeaders[e].toLowerCase();
        });
    }

    findKeyForHeader(name: string): string {
        for (let x in this.headers) {
            if (this.headers[x] === name) {
                return x.replace(/[0-9]/g, '');
            }
        }
        throw 'no key for header found';
    }

    getSheet(): WorkSheet {
        return this.workbook.Sheets[this.polis.branche]
    }

    setMaatschappijColumn(): void {
        let r = 0;
        let c = 0;

        while (this.maatschappijColumn === -1) {
            const cellRef: string = xlsx.utils.encode_cell({r, c});
            const cellObject: CellObject = this.getSheet()[cellRef];

            if (!cellInRange({r, c}, xlsx.utils.decode_range(this.getSheet()["!ref"]))) {
                this.maatschappijColumn = c;
                this.setCellByAddress({c, r: 0}, this.polis.maatschappij);
                this.increaseColumnRange(1);
            } else if (cellObject.w === this.polis.maatschappij) {
                this.maatschappijColumn = c;
            }

            c++;
        }
    }

    increaseRowRange(n: number = 1) {
        const range = xlsx.utils.decode_range(this.getSheet()["!ref"]);
        range.e.r = range.e.r + n;
        this.getSheet()["!ref"] = xlsx.utils.encode_range(range);
    }

    increaseColumnRange(n: number = 1) {
        const range = xlsx.utils.decode_range(this.getSheet()["!ref"]);
        range.e.c = range.e.c + n;
        this.getSheet()["!ref"] = xlsx.utils.encode_range(range);
    }

    setMaxRow(): void {
        const sheetRef = this.getSheet()["!ref"];

        if (!sheetRef) {
            this.maxRow = xlsx.utils.decode_row('1');
            return;
        }

        const range = xlsx.utils.decode_range(sheetRef);

        this.maxRow = range.e.r;
    }

    setMaxColumn(): void {
        const sheetRef = this.getSheet()["!ref"];

        // no ref means empty sheet
        if (!sheetRef) {
            this.maxColumn = xlsx.utils.decode_col('F');
            return
        }

        const range = xlsx.utils.decode_range(sheetRef);

        this.maxColumn = range.e.c;
    }

    public loopExistingLabels(): void {
        for (let r = 0; r <= this.maxRow; ++r) {
            const omschrijvingCell = this.getCellByAddress({
                r,
                c: xlsx.utils.decode_col(this.findKeyForHeader('omschrijving'))
            });
            const inhoudCell = this.getCellByAddress({
                r,
                c: xlsx.utils.decode_col(this.findKeyForHeader('inhoud'))
            });

            const omschrijving: string | undefined = <string | undefined>omschrijvingCell?.v;
            const inhoud: string | undefined = <string | undefined>inhoudCell?.v;

            if (!omschrijving || !inhoud) continue;

            for (let regel of this.polis.regels) {
                if (!regel) continue;
                if ((toLowerCase(omschrijving) === toLowerCase(regel.omschrijving))
                    && compareInhoud(inhoud, regel.inhoud)) {
                    const labelRange = this.identifyLabelRange(r);
                    labelRange.s.c = this.maatschappijColumn;
                    labelRange.e.c = this.maatschappijColumn;
                    loopCellRange(labelRange, ((cellReference: string) => {
                        this.setCellByKey(cellReference, 'x');
                    }), this);
                    regel.processed = true;
                    r = labelRange.e.r;
                }
            }
        }
    }

    public identifyLabelRange(r: number): Range {
        const c: number = xlsx.utils.decode_col(this.findKeyForHeader('omschrijving'));
        let row = r;
        let value: string | undefined;

        while (!value) {
            const cellAddress = {r: row, c: c};
            const cellObject: CellObject = this.getSheet()[xlsx.utils.encode_cell(cellAddress)];

            if (!!cellObject) {
                value = cellObject.w;
            }

            if (!cellInRange(cellAddress, xlsx.utils.decode_range(this.getSheet()["!ref"]))) {
                return {s: {c, r}, e: {c, r: row}};
            }

            row = row + 1;
        }

        return {s: {c, r}, e: {c, r: row - 1}};
    }

    public addUnprocessedLabels(): void {
        this.polis.regels.forEach((regel: Regel) => {
            if (!regel) return;
            if (regel.processed) return;

            const newRange = addLabelToSheet.call(this, regel);
            this.maxRow = newRange.e.r;
            this.increaseRowRange(1);
        });
    }

    public save(dest: string): void {
        xlsx.writeFile(this.workbook, path.resolve(dest));
    }
}
