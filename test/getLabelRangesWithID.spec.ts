import {Sheet} from "xlsx";
import {RangeID} from "../src/sortRangesByID";
import {getLabelRangesWithID} from "../src/getLabelRangesWithID";

const xlsx = require('xlsx');

let sheetObj: Sheet;
let ranges: RangeID[];

beforeAll(() => {
    sheetObj = require('./static/dummysheet.json');
});

describe('omschrijving as identifying column', () => {

    beforeAll(() => {
        ranges = getLabelRangesWithID(sheetObj, 'A', {r: 0, c: 0}, 1);
    });

    test('first range', () => {
        expect(ranges[0].range)
            .toStrictEqual(xlsx.utils.decode_range('A2:I3'));
        expect(ranges[0].id).toBe('Soort verzekering');
    });

    test('middle range', () => {
        expect(ranges[5].range)
            .toStrictEqual(xlsx.utils.decode_range('A13:I14'));
        expect(ranges[5].id).toBe('Bouwjaar');
    });

    test('triple row range', () => {
        expect(ranges[2].range)
            .toStrictEqual(xlsx.utils.decode_range('A6:I8'));
        expect(ranges[2].id).toBe('Merk en type');
    });

    test('single row range', () => {
        expect(ranges[15].range)
            .toStrictEqual(xlsx.utils.decode_range('A34:I34'));
        expect(ranges[15].id).toBe('Verzekerde rubrieken');
    });

    test('end row range', () => {
        expect(ranges[17].range)
            .toStrictEqual(xlsx.utils.decode_range('A36:I36'));
        expect(ranges[17].id).toBe('Verzekerde rubrieken');
    });

    test('range list borders', () => {
        expect(ranges.length).toBe(18);
    });
});

describe('weergave as identifying column no start row', () => {

    beforeAll(() => {
        ranges = getLabelRangesWithID(sheetObj, 'C', {r: 0, c: 5});
    });

    test('first range', () => {
        expect(ranges[0].range)
            .toStrictEqual(xlsx.utils.decode_range('A1:I2'));
        expect(ranges[0].id).toBe('regel template');
    });

    test('long range', () => {
        expect(ranges[1].range)
            .toStrictEqual(xlsx.utils.decode_range('A3:I13'));
        expect(ranges[1].id).toBe('');
    });
});
