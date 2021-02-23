import yargs from "yargs";
import path from "path";
import {WorkBook} from "xlsx";

const xlsx = require('xlsx');

const argv = yargs(process.argv.slice(2)).options({
    f: {
        type: 'string',
        demandOption: true,
        description: 'path to excel file'
    }
}).argv;

if (path.extname(argv.f) !== '.xlsx') {
    throw 'argument -f does not have .xlsx as extension, check that you use an excel file'
}

const workbook: WorkBook = xlsx.readFile(argv.f);
const sheetNames: string[] = workbook.SheetNames;

for (let i = 0; i < sheetNames.length; ++i) {

    // if the sheet name is not 5 numbers, ignore it
    if (!/\d{5}/.test(sheetNames[i])) continue;


    console.log(sheetNames[i]);
}
