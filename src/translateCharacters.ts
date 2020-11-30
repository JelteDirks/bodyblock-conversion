const conversion: CharCodeConversion[] = [
    {
        original: 213,
        replacement: '€'
    },
    {
        original: 12,
        replacement: ''
    }
];

export function translateCharacters(input: string): string {
    return Array.prototype.map.call(input, (character: string) => {
        for (let conv of conversion) {
            if (character.charCodeAt(0) === conv.original) {
                return conv.replacement
            }
        }
        return character;
    }).join('');
}


export interface CharCodeConversion {
    original: number;
    replacement: string;
}