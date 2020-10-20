import path from "path";
import {CellAddress, CellObject, Range, WorkBook, WorkSheet} from "xlsx";
import {Polis} from "./Polis";
import {getNextColumnKey} from "./getNextColumnKey";
import {Regel} from "./Regel";
import {toLowerCase} from "./toLowerCase";
import {compareInhoud} from "./compareInhoud";
import {cellInRange} from "./cellInRange";

const xlsx = require('xlsx');

export class ExcelController {

    private readonly workbook: WorkBook;
    private static defaultHeaders: { [key: string]: any } = {
        A1: 'omschrijving',
        B1: 'inhoud',
        C1: 'weergave',
        D1: 'uitlijnen',
        E1: 'regel verwijderen',
        F1: 'regel template'
    }
    private headers: { [key: string]: any } = {};
    private maatschappijColumn: string = '';
    private maxRow: number = -1;
    private maxColumn: string = '';
    private polis: Polis;

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
        this.fillHeaders();
    }

    private setCell(key: string, value: any) {

        if (this.cellExists(key)) {
            this.getCell(key).v = value;
            return
        }

        this.workbook.Sheets[this.polis.branche][key] = {};
        this.getCell(key).v = value;
    }

    private getCell(key: string): CellObject {
        return this.getSheet()[key];
    }

    private cellExists(key: string): boolean {
        return !!this.getCell(key);
    }

    private fillHeaders() {
        this.headers = {...ExcelController.defaultHeaders};
        let col = 'A';

        while (col !== getNextColumnKey(this.maxColumn)) {
            const cell = this.getCellValueByRowCol(1, col);
            if (!cell) continue;
            this.headers[`${col}1`] = String.prototype.toLowerCase.call(cell.v);
            col = getNextColumnKey(col);
        }
    }

    private getHeadersAsArray(): string[] {
        return Object.keys(ExcelController.defaultHeaders).map((e: string) => {
            return ExcelController.defaultHeaders[e].toLowerCase();
        });
    }

    private findKeyForHeader(name: string): string {
        for (let x in this.headers) {
            if (this.headers[x] === name) {
                return x.replace(/[0-9]/g, '');
            }
        }
        throw 'no key for header found';
    }

    private getSheet(): WorkSheet {
        return this.workbook.Sheets[this.polis.branche]
    }

    private getCellValueByRowCol(row: string | number, column: string): CellObject | undefined {
        const sheet = this.getSheet();
        return sheet[`${column}${row}`];
    }

    private setMaatschappijColumn(): void {
        let currentKey = 'A';
        const sheet = this.getSheet();

        while (currentKey !== getNextColumnKey(this.maxColumn)) {
            const value = sheet[`${currentKey}1`].v;

            if (value === this.polis.maatschappij) {
                this.maatschappijColumn = currentKey;
                return;
            }

            currentKey = getNextColumnKey(currentKey);
        }

        this.maatschappijColumn = getNextColumnKey(this.maxColumn);
        this.increaseColumnRange();
        this.setCell(`${this.maatschappijColumn}1`, this.polis.maatschappij);
    }

    private increaseRowRange(n: number = 1) {
        const match = this.getSheet()["!ref"]?.match(/^[A-Z]+[0-9]+:[A-Z]+([0-9]+)/);
        if (!match) throw 'no match found for !ref';
        const ref = match[0];
        const oldRow = match[1];
        const newRow: number = xlsx.utils.decode_row(oldRow) + n;
        this.getSheet()["!ref"] = ref.replace(/[0-9]+$/, xlsx.utils.encode_row(newRow));
    }

    private increaseColumnRange(n: number = 1) {
        const match = this.getSheet()["!ref"]?.match(/^[A-Z]+[0-9]+:([A-Z]+)[0-9]+$/);
        if (!match) throw 'no match found for !ref';
        const ref = match[0];
        const oldColumn = match[1];
        const newColumn: number = xlsx.utils.decode_col(oldColumn) + n;
        this.getSheet()["!ref"] = ref.replace(/:[A-Z]+/, `:${xlsx.utils.encode_col(newColumn)}`);
    }

    private setMaxRow(): void {
        const sheet = this.getSheet();
        const ref = sheet['!ref'];

        // no ref means empty sheet
        if (!ref) {
            this.maxRow = 1;
            return
        }

        const matcher = ref.match(/^[A-Z]+[0-9]+:[A-Z]+([0-9]+)$/);

        if (matcher === null) {
            throw 'ref could not be matched for max row';
        }

        this.maxRow = Number(matcher[1]);
    }

    private setMaxColumn(): void {
        const sheet = this.getSheet();
        const ref = sheet['!ref'];

        // no ref means empty sheet
        if (!ref) {
            this.maxColumn = 'F';
            return
        }

        const matcher = ref?.match(/^[A-Z]+[0-9]+:([A-Z]+)[0-9]+$/);

        if (matcher === null) {
            throw 'ref could not be matched for max column';
        }

        this.maxColumn = matcher[1];
    }

    public loopExistingLabels(): void {
        for (let r = 1; r <= this.maxRow; ++r) {
            const maatschappijKey = `${this.maatschappijColumn}${r}`
            const omschrijvingCell = this.getCellValueByRowCol(r, this.findKeyForHeader('omschrijving'));
            const inhoudCell = this.getCellValueByRowCol(r, this.findKeyForHeader('inhoud'));

            const omschrijving: string | undefined = <string | undefined>omschrijvingCell?.v;
            const inhoud: string | undefined = <string | undefined>inhoudCell?.v;

            if (!omschrijving || !inhoud) continue;

            console.log(omschrijving, this.identifyLabelRange(r));

            for (let regel of this.polis.regels) {
                if (!regel) continue;
                if ((toLowerCase(omschrijving) === toLowerCase(regel.omschrijving))
                    && compareInhoud(inhoud, regel.inhoud)) {
                    this.setCell(maatschappijKey, 'x');
                    regel.processed = true;
                }
            }
        }
    }

    public identifyLabelRange(r: number): Range {
        const column = 'A';
        let row = r;
        let value: string | undefined;

        while (!value) {
            const cellAddress = {r: row, c: xlsx.utils.decode_col(column)};
            const cellObject: CellObject = this.getSheet()[xlsx.utils.encode_cell(cellAddress)];

            if (!!cellObject) {
                value = cellObject.w;
            }

            if (!cellInRange(cellAddress, xlsx.utils.decode_range(this.getSheet()["!ref"]))) {
                return {s: {c: xlsx.utils.decode_col(column), r}, e: {c: xlsx.utils.decode_col(column), r: row}};
            }

            row = row + 1;
        }

        return {s: {c: xlsx.utils.decode_col(column), r}, e: {c: xlsx.utils.decode_col(column), r: row - 1}};
    }

    public addUnprocessedLabels(): void {
        this.polis.regels.forEach((regel: Regel) => {
            if (!regel) return;
            if (regel.processed) return;
            this.increaseRowRange();
            this.setCell(xlsx.utils.encode_cell({r: ++this.maxRow, c: 1}), 'asd');
            // TODO: make method for adding new row with label
        });
    }

    public save(): void {
        xlsx.writeFile(this.workbook, path.resolve('static/new.xlsx'));
    }
}
