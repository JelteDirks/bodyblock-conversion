#! /usr/local/bin node

console.log('hello!');

import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {processLine} from "../processLine";
import {Regel} from "../Regel";
import {Polis} from "../Polis";
import {ExcelController} from "../ExcelController";

const testfilepath = path.resolve('formulieren/06000/FML0200029');
const polis = new Polis();
const counterLineRE = /[0-9]{15,}/;
const bouwsteenLine = /^Bouwsteen\s*.*\s*:\s*/;
const startSpace = /^\s*/;
let offset = -1;

(async function () {
    const filestream = fs.createReadStream(testfilepath, {
        encoding: "latin1"
    });

    const rlInterface = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    for await (const line of rlInterface) {
        // calculate offset when counter line found
        if (counterLineRE.test(line) && offset === -1) {
            const exec = startSpace.exec(line);
            if (exec !== null) {
                offset = exec[0].lastIndexOf(' ') + 1;
            }
        }

        // find polis info when 'Bouwsteen' line is found
        if (bouwsteenLine.test(line)) {
            const reversed: string[] = line.split('/').reverse();
            polis.maatschappij = reversed[0];
            polis.branche = reversed[1];
            polis.hoofdbranche = reversed[2];
        }

        processLine(line, polis.regels, offset);
    }

    polis.regels.forEach((r: Regel) => {
        r.setOmschrijving();
        r.setInhoud();
        r.setInhoudLabels();
        r.setTemplateLabels();
    });

    const excelController = new ExcelController('static/hb6000.xlsx', polis);

    excelController.loopExistingLabels();
    excelController.addUnprocessedLabels();
    excelController.save();
})();



