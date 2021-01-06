import {Sheet} from "xlsx";
import {identifyLabelRange} from "../src/indentifyLabelRange";

const xlsx = require('xlsx');

describe('identifying label range', () => {

    let sheetObj: Sheet;

    beforeAll(() => {
        sheetObj = require('./static/dummysheet.json');
    });

    test('first label', () => {
        expect(identifyLabelRange(sheetObj, 1, 'A'))
            .toStrictEqual(xlsx.utils.decode_range('A2:I3'));
    });

    test('single line label', () => {
        expect(identifyLabelRange(sheetObj, 33, 'A'))
            .toStrictEqual(xlsx.utils.decode_range('A34:I34'));
    });

    test('last line', () => {
        expect(identifyLabelRange(sheetObj, 35, 'A'))
            .toStrictEqual(xlsx.utils.decode_range('A36:I36'));
    });

    test('triple row label', () => {
        expect(identifyLabelRange(sheetObj, 20, 'A'))
            .toStrictEqual(xlsx.utils.decode_range('A21:I23'));
    });

    test('', () => {
        expect(identifyLabelRange(sheetObj, 2, 'C'))
            .toStrictEqual(xlsx.utils.decode_range('A3:I13'));
    });
});
