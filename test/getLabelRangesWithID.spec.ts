import {Sheet} from "xlsx";
import {RangeID} from "../src/sortRangesByID";
import {getLabelRangesWithID} from "../src/getLabelRangesWithID";

const xlsx = require('xlsx');

describe('get ranges with id from excel file', () => {

    let sheetObj: Sheet;
    let ranges: RangeID[];

    beforeAll(() => {
        sheetObj = require('./static/dummysheet.json');
        ranges = getLabelRangesWithID(sheetObj, 'A', {r: 0, c: 0});
    });

    test('first range', () => {
        expect(ranges[1].range)
            .toStrictEqual(xlsx.utils.decode_range('A2:I3'));
        expect(ranges[1].id).toBe('Soort verzekering');
    });
});
