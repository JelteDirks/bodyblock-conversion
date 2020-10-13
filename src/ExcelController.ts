import path from "path";
import {WorkBook} from "xlsx";
import {Polis} from "./Polis";
import {getNextColumnKey} from "./getNextColumnKey";

const xlsx = require('xlsx');

export class ExcelController {

    private readonly workbook: WorkBook;
    private static defaultHeaders: { [key: string]: any } = {
        A1: 'Omschrijving',
        B1: 'Inhoud',
        C1: 'Weergave',
        D1: 'Uitlijnen',
        E1: 'Regel verwijderen',
        F1: 'Regel template'
    }
    private maatschappijColumn: string = '';
    private maxRow: number = -1;
    private maxColumn: string = '';
    private polis: Polis;

    private getHeadersAsArray(): string[] {
        return Object.keys(ExcelController.defaultHeaders).map((e: string) => {
            return ExcelController.defaultHeaders[e]
        });
    }

    private findKeyForHeader(name: string) {
        for (let x in ExcelController.defaultHeaders) {
            if (ExcelController.defaultHeaders[x] === name) {
                return x;
            }
        }
    }

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

    private getSheet() {
        return this.workbook.Sheets[this.polis.branche]
    }

    private setMaatschappijColumn(): void {
        let currentKey = 'A';
        const sheet = this.getSheet();

        while (currentKey !== this.maxColumn) {
            const value = sheet[`${currentKey}1`].v;

            if (value === this.polis.maatschappij) {
                this.maatschappijColumn = currentKey;
                return;
            }

            currentKey = getNextColumnKey(currentKey);
        }

        this.maatschappijColumn = getNextColumnKey(this.maxColumn);
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

    public loopExistingLabels() {
        for (let r = 0; r <= this.maxRow; ++r) {
            console.log(this.getSheet()[`${this.findKeyForHeader('Omschrijving')}1`]);
        }
    }

    public save(): void {
        xlsx.writeFile(this.workbook, path.resolve('static/new.xlsx'));
    }
}