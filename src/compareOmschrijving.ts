import {toLowerCase} from "./toLowerCase";

export function compareOmschrijving(a: string, b: string): boolean {
    return toLowerCase(a).trim() === toLowerCase(b).trim();
}
