import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setInhoud(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {

    const offset = {r: 0, c: 1};
    const position = {r: r.range.s.r, c: r.range.s.c + offset.c};
    const inhoudCell = sheet[xlsx.utils.encode_cell(position)];
    const inhoudColumnInt = xlsx.utils.decode_col('B');
    const weergaveColumnInt = xlsx.utils.decode_col('C');

    let inhoud = inhoudCell?.v || '';

    for (let i = r.range.s.r + 1; i <= r.range.e.r; ++i) {
        let value = sheet[xlsx.utils.encode_cell({r: i, c: inhoudColumnInt})]?.v;
        if (!value) continue;

        let weergave = sheet[xlsx.utils.encode_cell({r: i, c: weergaveColumnInt})]?.v;
        let modifier = ''

        if (weergave.trim() === 'Omschrijving') {
            modifier = 'o';
        } else if (weergave.trim() === 'Code') {
            modifier = 'c';
        }

        inhoud = inhoud.replace(value, '${' + value + modifier + '}');
    }

    return Object.assign(obj, {inhoud});
}