import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setOmschrijving(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {

    let omschrijvingCell = sheet[xlsx.utils.encode_cell(r.range.s)];

    let omschrijving = omschrijvingCell?.v || '';

    if (omschrijving === 'n/a') {
        omschrijving = '';
    }

    return Object.assign(obj, {omschrijving});

}