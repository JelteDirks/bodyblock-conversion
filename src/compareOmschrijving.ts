import {toLowerCase} from "./toLowerCase";

const spacesOnly = /^\s*$/
const testre = /.*ansprakelijkheid.*/;

export function compareOmschrijving(a: string, b: string): boolean {

    console.log('comparing', a, b);

    if (spacesOnly.test(a) && spacesOnly.test(b)) return true;

    if (toLowerCase(a).trim() === toLowerCase(b).trim()) return true;

    return false;
}
