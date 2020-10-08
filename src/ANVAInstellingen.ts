export const anvaInstellingen: ANVAInstellingen[] = [
    {
        title: 'Uitlijnen',
        value: /^\s*Uitlijnen\s([a-zA-Z])/,
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
        title: 'Weergave',
        value: /\s+Weergave:\s(\w*)/,
        groups: [
            {
                n: 1,
                t: 'weergave'
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
    t: 'uitlijnen' | 'weergave' | 'verwijderen' | 'uitWacht' | 'labelnummer'; // group title
}

export interface Instellingen {
    uitlijnen?: 'Links' | 'Rechts';
    weergave?: 'Omschrijving' | 'Code';
    verwijderen?: 'niet verwijderen' | 'verwijderen';
    uitWacht?: 'Nee' | 'Ja';
    labelnummer?: string;
}