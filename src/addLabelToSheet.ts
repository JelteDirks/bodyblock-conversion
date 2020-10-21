import {ExcelController} from "./ExcelController";
import {Range} from "xlsx";
import {Regel} from "./Regel";
import * as xlsx from "xlsx";

const instellingenMap: { [key: string]: string } = {
    'labelnummer': 'inhoud',
    'uitlijnen': 'uitlijnen',
    'weergave': 'weergave',
    'verwijderen': 'regel verwijderen'
}

export function addLabelToSheet(this: ExcelController, regel: Regel): Range {

    let r = this.maxRow + 1; // index to be used for adding new rows on top of the existing
    let c = 0; // index to be used for add new columns on top of the existing

    if (regel.omschrijving) {
        c = xlsx.utils.decode_col(this.findKeyForHeader('omschrijving'));
        this.setCellByAddress({r, c}, regel.omschrijving);
    }

    if (regel.inhoud) {
        c = xlsx.utils.decode_col(this.findKeyForHeader('inhoud'));
        this.setCellByAddress({r, c}, regel.inhoud);
    }

    if (regel.regelTemplate) {
        c = xlsx.utils.decode_col(this.findKeyForHeader('regel template'));
        this.setCellByAddress({r, c}, regel.regelTemplate);
    }

    this.setCellByAddress({r, c: this.maatschappijColumn}, 'x');

    for (let positie of regel.posities) {
        if (Object.keys(positie.instellingen).length <= 0) continue;

        r++
        this.increaseRowRange(1);

        Object.keys(positie.instellingen).forEach((key: string) => {
            const columntitel = instellingenMap[key];

            if (!columntitel) throw 'no column title found for instelling ' + key;

            c = xlsx.utils.decode_col(this.findKeyForHeader(columntitel));
            // @ts-ignore
            this.setCellByAddress({r, c}, positie.instellingen[key]);
        });
    }

    return {s: {c: 0, r: 0}, e: {c: this.maxColumn, r}}
}
