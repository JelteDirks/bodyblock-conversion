import {Sheet} from "xlsx";
import path from "path";

const xlsx = require('xlsx');

export function saveSheet(sheetObj: Sheet, location: string) {

    const wb = xlsx.utils.book_new();

    xlsx.utils.book_append_sheet(wb, sheetObj, 'test');

    xlsx.writeFile(wb, path.resolve(location));

}
