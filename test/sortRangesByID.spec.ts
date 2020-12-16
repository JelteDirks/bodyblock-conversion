import {RangeID, sortRangesByID} from "../src/sortRangesByID";

describe('sort ranges', () => {

    test('single range', () => {
        const originalRanges = [
            {
                id: 'only',
                range: {s: {r: 1, c: 0}, e: {r: 2, c: 6}}
            }
        ];

        expect(sortRangesByID(originalRanges)).toStrictEqual([
            {
                id: 'only',
                range: {s: {r: 1, c: 0}, e: {r: 2, c: 6}}
            }
        ]);
    });

    test('flip ranges', () => {
        const originalRanges: RangeID[] = [
            {
                id: 'b',
                range: {s: {r: 1, c: 0}, e: {r: 2, c: 6}}
            },
            {
                id: 'a',
                range: {s: {r: 3, c: 0}, e: {r: 4, c: 6}}
            }
        ];

        expect(sortRangesByID(originalRanges)).toStrictEqual([
            {
                id: 'a',
                range: {s: {r: 1, c: 0}, e: {r: 2, c: 6}}
            },
            {
                id: 'b',
                range: {s: {r: 3, c: 0}, e: {r: 4, c: 6}}
            }
        ])
    });

});
