import yargs from "yargs";
import path from "path";
import {Sheet, WorkBook} from "xlsx";
import {RangeID} from "../sortRangesByID";
import {getLabelRangesWithID} from "../getLabelRangesWithID";
import {labelRangeToObj} from "../labelRangeToObj";

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

// loop all sheets in the workbook
for (let i = 0; i < sheetNames.length; ++i) {

    // if the sheet name is not 5 numbers, ignore it
    if (!/\d{5}/.test(sheetNames[i])) continue;

    // retrieve the current sheet
    let sheet: Sheet = workbook.Sheets[sheetNames[i]];

    // get labels that are on this sheet
    let labelRanges: RangeID[] = getLabelRangesWithID(sheet, 'F', {r: 0, c: 0}, 1);

    // process every individual label
    for (let j = 0; j < labelRanges.length; ++j) {
        let obj = labelRangeToObj(labelRanges[j], sheet);
        console.log(obj);
    }
}
