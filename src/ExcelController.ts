import path from "path";
import {CellObject, WorkBook, WorkSheet} from "xlsx";
import {Polis} from "./Polis";
import {getNextColumnKey} from "./getNextColumnKey";
import {Regel} from "./Regel";
import {toLowerCase} from "./toLowerCase";

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
    private newRegelQ: Regel[] = [];

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
        this.getSheet()["!ref"] = `A1:${this.maatschappijColumn}${this.maxRow}`;
        this.setCell(`${this.maatschappijColumn}1`, this.polis.maatschappij);
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

            this.polis.regels.forEach((regel: Regel) => {
                if ((toLowerCase(omschrijving) === toLowerCase(regel.omschrijving))
                    && (toLowerCase(inhoud) === toLowerCase(regel.inhoud))) {
                    this.setCell(maatschappijKey, 'x');
                } else {
                    this.newRegelQ.push(regel);
                }
            });
        }
    }

    public save(): void {
        xlsx.writeFile(this.workbook, path.resolve('static/new.xlsx'));
    }
}
