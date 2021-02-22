import {RangeID, sortRangesByID} from "../src/sortRangesByID";

describe('sorting ranges by their ID', () => {

    test('regular range', () => {
        const original: RangeID[] = [
            {
                id: '03 Soort verzekering',
                range: {
                    s: {r: 1, c: 0},
                    e: {r: 2, c: 8}
                }
            },
            {
                id: '02 Verzekerd Object',
                range: {
                    s: {r: 3, c: 0},
                    e: {r: 4, c: 8}
                }
            }
        ];

        const sorted: RangeID[] = [
            {
                id: '02 Verzekerd Object',
                range: {
                    s: {r: 1, c: 0},
                    e: {r: 2, c: 8}
                }
            },
            {
                id: '03 Soort verzekering',
                range: {
                    s: {r: 3, c: 0},
                    e: {r: 4, c: 8}
                }
            }
        ];

        const {sorted: actualSorted, original: actualOriginal} = sortRangesByID(original);

        expect(JSON.stringify({sorted: actualSorted, original: actualOriginal}, null, 2))
            .toBe(JSON.stringify({sorted, original}, null, 2));
    });
});
