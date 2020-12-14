import {Positie} from "./Positie";

export function isPrinthulpLabel(positie: Positie): boolean {

    let label: boolean = !!positie.instellingen.labelnummer || false;
    let printhulp: boolean = !!positie.instellingen.printhulp || false;

    return label && printhulp;
}
