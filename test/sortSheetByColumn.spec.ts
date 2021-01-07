import {Sheet} from "xlsx";
import {sortBoy} from "../src/sortBoy";

const xlsx = require('xlsx');

describe('regel template sort', () => {

    let sheetObj: Sheet;

    beforeAll(() => {
        sheetObj = require('./static/dummysheet.json');
    });

    test('sort dummy', () => {
        const sorted = sortBoy(sheetObj, 'A', {r: 0, c: 0}, 1);
    });
})
