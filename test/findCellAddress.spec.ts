import {Sheet} from "xlsx";
import {findCellAddress} from "../src/findCellAddress";

const xlsx = require('xlsx');

describe('finding cell addresses by string content', () => {
    let sheetObject: Sheet;

    beforeAll(() => {
        sheetObject = require('./static/dummysheet.json');
    });

    test('find title', () => {
        expect(findCellAddress(sheetObject, 'omschrijving'))
            .toStrictEqual(['A1']);
    });

    test('find title with range', () => {
        expect(findCellAddress(sheetObject, 'omschrijving', xlsx.utils.decode_range('A1:A7')))
            .toStrictEqual(['A1']);
    });

    test('find internal cell', () => {
        expect(findCellAddress(sheetObject, '10038 kg'))
            .toStrictEqual(['B17']);
    });

    test('find internal cell with range', () => {
        expect(findCellAddress(sheetObject, '10038 kg', xlsx.utils.decode_range('A1:E30')))
            .toStrictEqual(['B17']);
    });

    test('find edge cell', () => {
        expect(findCellAddress(sheetObject, 'P382'))
            .toStrictEqual(['I1']);
    });

});
