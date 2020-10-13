import path from "path";
import {WorkBook} from "xlsx";
import {Polis} from "./Polis";

const xlsx = require('xlsx');

export class ExcelController {

    private workbook: WorkBook;
    private static defaultHeaders = {
        A1: 'Omschrijving',
        B1: 'Inhoud',
        C1: 'Weergave',
        D1: 'Uitlijnen',
        E1: 'Regel',
        F1: 'verwijderen'
    }
    private maatschappijColumn: string = '';

    constructor(file: string, polis: Polis) {

        this.workbook = xlsx.readFile(path.resolve(file));
        const sheets = this.workbook.Sheets;

        if (!sheets.hasOwnProperty(polis.branche)) {
            xlsx.utils.book_append_sheet(this.workbook, xlsx.utils.aoa_to_sheet([]), polis.branche);
        }
    }

    public save():void {
        xlsx.writeFile(this.workbook, path.resolve('test/new.xlsx'));
    }
}