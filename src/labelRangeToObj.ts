import {RangeID} from "./sortRangesByID";
import {setOmschrijving} from "./objectsetters/setOmschrijving";
import {Sheet} from "xlsx";
import {setInhoud} from "./objectsetters/setInhoud";

export function labelRangeToObj(r: RangeID, sheet: Sheet): { [key: string]: any } {
    console.log('processing', r.id);

    let obj: { [key: string]: any } = {};

    obj = setOmschrijving(r, sheet, obj);
    obj = setInhoud(r, sheet, obj);

    return obj;
}