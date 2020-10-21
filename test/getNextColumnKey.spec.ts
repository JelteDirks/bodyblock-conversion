import {getNextColumnKey} from "../src/getNextColumnKey";

describe('increasing the column key', () => {

    test('base cases', () => {
        expect(getNextColumnKey('A')).toBe('B');
        expect(getNextColumnKey('Y')).toBe('Z');
    });

    test('edge cases', () => {
        expect(getNextColumnKey('Z')).toBe('AA');
        expect(getNextColumnKey('AZ')).toBe('BA');
    });

    test('steps',() => {
        expect(getNextColumnKey('AD')).toBe('AE');
        expect(getNextColumnKey('XXX')).toBe('XXY');
    });
});