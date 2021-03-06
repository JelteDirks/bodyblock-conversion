export const anvaInstellingen: ANVAInstellingen[] = [
    {
        title: 'Uitlijnen',
        value: /^\s*Uitlijnen\s([a-zA-Z]+)/,
        groups: [
            {
                n: 1,
                t: 'uitlijnen'
            }
        ]
    },
    {
        title: 'Label',
        value: /^\s+Label\s([0-9]{5})\s*:/,
        groups: [
            {
                n: 1,
                t: 'labelnummer'
            }
        ]
    },
    {
        title: 'Label',
        value: /^Regel\s+([0-9]+)\s+Positie\s+([0-9]*)\s+Label\s([0-9]{5}).*/,
        groups: [
            {
                n: 3,
                t: 'labelnummer'
            }
        ]
    },
    {
        title: 'Weergave',
        value: /\s+Weergave:\s(.*)/,
        groups: [
            {
                n: 1,
                t: 'weergave'
            }
        ]
    },
    {
        title: 'Weergave',
        value: /^\s+Label\s*\d{5}\s*:\s*(Printhulplabel).*/,
        groups: [
            {
                n: 1,
                t: 'printhulp'
            }
        ]
    },

    {
        title: 'Regel verwijderen',
        value: /\s+Regel\s((niet\s)?verwijderen)\sindien\slabel\sniet\sgevuld.*/,
        groups: [
            {
                n: 1,
                t: 'verwijderen'
            }
        ]
    }
];

export interface ANVAInstellingen {
    title: string;
    value: RegExp;
    groups: GroepInstellingen[]
}

export interface GroepInstellingen {
    n: number; // group number
    t: 'uitlijnen' | 'weergave' | 'verwijderen' | 'uitWacht' | 'labelnummer' | 'printhulp'; // group title
}

export interface Instellingen extends Object {
    uitlijnen?: 'Links' | 'Rechts';
    weergave?: string;
    verwijderen?: 'niet verwijderen' | 'verwijderen';
    uitWacht?: 'Nee' | 'Ja';
    labelnummer?: string;
    printhulp?: 'Printhulp';
}
