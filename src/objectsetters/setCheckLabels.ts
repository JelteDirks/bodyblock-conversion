import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setCheckLabels(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {

    const labelColumn = xlsx.utils.decode_col('B');
    const verwijderColumn = xlsx.utils.decode_col('E');
    const weergaveColumn = xlsx.utils.decode_col('C');
    const checkLabels: string[] = [];

    for (let i = r.range.s.r + 1; i <= r.range.e.r; ++i) {
        let label = sheet[xlsx.utils.encode_cell({r: i, c: labelColumn})]?.v;
        let verwijderen = sheet[xlsx.utils.encode_cell({r: i, c: verwijderColumn})]?.v;
        let weergave = sheet[xlsx.utils.encode_cell({r: i, c: weergaveColumn})]?.v;

        let modifier = ''

        if (weergave?.trim() === 'Omschrijving') {
            modifier = 'o';
        } else if (weergave?.trim() === 'Code') {
            modifier = 'c';
        }

        if (!label || !verwijderen) continue;

        if (verwijderen.trim().toLowerCase() === 'verwijderen') {
            checkLabels.push(label + modifier);
        }
    }

    return Object.assign(obj, {checkLabels});
}
