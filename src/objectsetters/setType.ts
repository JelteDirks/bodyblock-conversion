import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setType(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {
    const weergaveColumn = xlsx.utils.decode_col('C');

    const inhoudColumn = xlsx.utils.decode_col('B');
    const inhoud = sheet[xlsx.utils.encode_cell({c: inhoudColumn, r: r.range.s.r})]?.v;

    console.log(inhoud);

    return Object.assign(obj, {});
}
