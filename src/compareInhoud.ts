import {toLowerCase} from "./toLowerCase";

const labelOnlyRegex: RegExp = /^(\s|[0-9]{5})+$/;
const labelRegex: RegExp = /[0-9]{5}/g;

export function compareInhoud(a: string, b: string): boolean {


    if (toLowerCase(a) === toLowerCase(b)) return true;

    if (labelOnlyRegex.test(a) && labelOnlyRegex.test(b)) {
        let x;

        while ((x = labelRegex.exec(a)) !== null) {
            if (b.indexOf(x[0]) < 0) return false;
        }

        while ((x = labelRegex.exec(b)) !== null) {
            if (a.indexOf(x[0]) < 0) return false;
        }

        return true;
    }

    return false;
}
