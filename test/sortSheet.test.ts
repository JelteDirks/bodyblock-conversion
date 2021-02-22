import {sortBoy} from "../src/sortBoy";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

describe('sorting entire sheet', () => {

    let sheetObj: Sheet;

    beforeAll(() => {
        sheetObj = require('./static/sort/dummysheet.json');
    });

    test('sort by template', () => {

        const expectedSorted = require('./static/sort/dummysheetsorted.json');

        const sorted = sortBoy(sheetObj, 'F', {c: 5, r: 0}, 1);

        expect(JSON.stringify(sorted, null, 2))
            .toBe(JSON.stringify(expectedSorted, null, 2));
    });

});
