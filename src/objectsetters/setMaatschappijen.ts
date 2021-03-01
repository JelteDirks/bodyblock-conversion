import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export function setMaatschappijen(r: RangeID, sheet: Sheet, obj: { [key: string]: any }, firstCompanyColInt: number): { [key: string]: any } {
    const maatschappijen: string[] = [];

    for (let i = firstCompanyColInt; i <= xlsx.utils.decode_range(sheet["!ref"]).e.c; ++i) {
        let company = sheet[xlsx.utils.encode_cell({r: 0, c: i})]?.v;
        let activeCell: string | undefined = sheet[xlsx.utils.encode_cell({r: r.range.s.r, c: i})]?.v;

        if (!company || !activeCell) continue;

        if (activeCell.trim().toLowerCase() === 'x') {
            maatschappijen.push(company.trim());
        }
    }

    return Object.assign(obj, {maatschappijen});
}
