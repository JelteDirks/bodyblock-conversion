#! /usr/local/bin node

import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {processLine} from "../processLine";
import {Regel} from "../Regel";
import {Polis} from "../Polis";
import {ExcelController} from "../ExcelController";
import yargs from "yargs";

const argv = yargs(process.argv.slice(2)).options({
    i: {
        type: 'string',
        demandOption: true,
        description: 'path to excel file that is used for filling',
        alias: ['input']
    },
    o: {
        type: 'string',
        demandOption: true,
        description: 'path to output excel file',
        alias: ['output']
    },
    src: {
        type: 'string',
        demandOption: true,
        description: 'path to source file used for filling the excel file',
        alias: ['source']
    }
}).argv;

if (path.extname(argv.o) !== '.xlsx') {
    throw 'output file does not have the correct extension (.xlsx): ' + path.extname(argv.o);
}

if (path.extname(argv.i) !== '.xlsx') {
    throw 'input file does not have the correct extension (.xlsx): ' + path.extname(argv.i);
}

if (!fs.existsSync(argv.src)) {
    throw 'source file does not exist: ' + argv.src;
}

if (!fs.existsSync(argv.i)) {
    throw 'input file does not exist: ' + argv.i;
}

if (!fs.existsSync(argv.o)) {
    throw 'output file does not exist: ' + argv.o;
}

const testfilepath = path.resolve(argv.src);
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

    const excelController = new ExcelController(argv.i, polis);

    excelController.loopExistingLabels();
    excelController.addUnprocessedLabels();
    excelController.save(argv.o);
})();



