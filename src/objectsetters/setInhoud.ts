import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setInhoud(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {

    const offset = {r: 0, c: 1};
    const position = {r: r.range.s.r, c: r.range.s.c + offset.c};
    const inhoudCell = sheet[xlsx.utils.encode_cell(position)];

    let inhoud = inhoudCell?.v || '';

    return Object.assign(obj, {inhoud});

}