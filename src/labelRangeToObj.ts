import {RangeID} from "./sortRangesByID";
import {setOmschrijving} from "./objectsetters/setOmschrijving";
import {Sheet} from "xlsx";
import {setInhoud} from "./objectsetters/setInhoud";

const xlsx = require('xlsx');

export function labelRangeToObj(r: RangeID, sheet: Sheet): { [key: string]: any } {
    const companyColumn = 'G';
    const companyColumnInt = xlsx.utils.decode_col(companyColumn);

    let obj: { [key: string]: any } = {};

    obj = setOmschrijving(r, sheet, obj);
    obj = setInhoud(r, sheet, obj);

    return obj;
}