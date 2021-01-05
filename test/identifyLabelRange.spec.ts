import {Sheet} from "xlsx";
import {identifyLabelRange} from "../src/indentifyLabelRange";

const xlsx = require('xlsx');

describe('identifying label range', () => {

    let sheetObj: Sheet;

    beforeAll(() => {
        sheetObj = require('./static/dummysheet.json');
    });

    test('first label', () => {
        expect(identifyLabelRange(sheetObj, 1, 'omschrijving'))
            .toStrictEqual(xlsx.utils.decode_range('A2:I3'));
    });

    test('first label no column name', () => {
        expect(identifyLabelRange(sheetObj, 1))
            .toStrictEqual(xlsx.utils.decode_range('A2:I3'));
    });

    test('single line label no column name', () => {
        expect(identifyLabelRange(sheetObj, 33))
            .toStrictEqual(xlsx.utils.decode_range('A34:I34'));
    });

    test('last line no column name', () => {
        expect(identifyLabelRange(sheetObj, 35))
            .toStrictEqual(xlsx.utils.decode_range('A36:I36'));
    });
});
