import {RangeID} from "../sortRangesByID";
import {Sheet} from "xlsx";

const xlsx = require('xlsx');

export interface TypeCheck {
    re: RegExp;
    type: string;
    replace?: (value: string) => string;
}
const typeChecks: TypeCheck[] = [
    {
        re: /^€\s\d{5}[oc]?$/,
        type: 'currency',
        replace: (value: string) => {
            return value.replace('€', '').trim();
        }
    },
    {
        re: /.*/,
        type: 'standaard'
    }
];

export function setType(r: RangeID, sheet: Sheet, obj: { [key: string]: any }): { [key: string]: any } {
    const weergaveColumn = xlsx.utils.decode_col('C');

    const inhoudColumn = xlsx.utils.decode_col('B');
    const inhoud = sheet[xlsx.utils.encode_cell({c: inhoudColumn, r: r.range.s.r})]?.v;

    for (let i = 0; i < typeChecks.length; i++) {
        const tc: TypeCheck = typeChecks[i];
        if (tc.re.test(inhoud)) {
            Object.assign(obj, {type: tc.type});

            if (!!tc.replace) {
                Object.assign(obj, {inhoud: tc.replace(inhoud)});
            }
        }
    }

    return Object.assign(obj, {});
}
