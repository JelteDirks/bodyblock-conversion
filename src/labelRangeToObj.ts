import {RangeID} from "./sortRangesByID";
import {setOmschrijving} from "./objectsetters/setOmschrijving";
import {Sheet} from "xlsx";
import {setInhoud} from "./objectsetters/setInhoud";
import {setMaatschappijen} from "./objectsetters/setMaatschappijen";
import {setCheckLabels} from "./objectsetters/setCheckLabels";
import {setType} from "./objectsetters/setType";

const xlsx = require('xlsx');

export function labelRangeToObj(r: RangeID, sheet: Sheet): { [key: string]: any } {
    const firstCompanyCol = 'G';
    const companyColumnInt = xlsx.utils.decode_col(firstCompanyCol);

    let obj: { [key: string]: any } = {};

    obj = setOmschrijving(r, sheet, obj);
    obj = setInhoud(r, sheet, obj);
    obj = setMaatschappijen(r, sheet, obj, companyColumnInt);
    obj = setCheckLabels(r, sheet, obj);
    obj = setType(r, sheet, obj);


    return obj;
}
