#! /usr/local/bin node

import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {LineProcessor} from "../LineProcessos";
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
    a: {
        type: 'string',
        demandOption: false,
        description: 'path to ANVA form which needs to be processed',
        alias: ['anva']
    },
    d: {
        type: 'string',
        demandOption: false,
        description: 'specify directory in which all files should be processed',
        alias: ['directory']
    }
}).argv;

if (path.extname(argv.o) !== '.xlsx') {
    throw 'output file does not have the correct extension (.xlsx): ' + path.extname(argv.o);
}

if (path.extname(argv.i) !== '.xlsx') {
    throw 'input file does not have the correct extension (.xlsx): ' + path.extname(argv.i);
}

if (!argv.a && !argv.d) {
    throw 'no source file or directory specified';
}

if (!fs.existsSync(argv.i)) {
    throw 'input file does not exist: ' + argv.i;
}

const counterLineRE = /[0-9]{15,}/;
const bouwsteenLine = /^Bouwsteen\s*.*\s*:\s*/;
const startSpace = /^\s*/;
let files: string[] = [];

if (argv.d) {
    files = fs.readdirSync(argv.d);
} else if (argv.a) {
    files = [path.resolve(argv.a)];
}

files.forEach(async (file: string, i: number) => {

    if (/DS_Store/.test(file)) {
        return;
    }

    let resolvedFilePath;

    if (argv.a) {
        resolvedFilePath = path.resolve(argv.a);
    } else if (argv.d) {
        resolvedFilePath = path.resolve(path.join(argv.d, file));
    }

    if (!resolvedFilePath) {
        console.warn(`resolved file path did not go well -d=${argv.d} -a=${argv.a}`);
        return;
    }

    const filestream = fs.createReadStream(resolvedFilePath, {
        encoding: "latin1"
    });

    const rlInterface = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    let offset = -1;
    let polis = new Polis();
    let processor = new LineProcessor();

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

        processor.processLine(line, polis.regels, offset);
    }

    polis.regels.forEach((r: Regel) => {
        r.setOmschrijving();
        r.setInhoud();
        r.setInhoudLabels();
        r.setTemplateLabels();
        r.translateCharacters();
    });

    const excelController = new ExcelController((i === 0) ? argv.i : argv.o, polis);

    excelController.loopExistingLabels();
    excelController.addUnprocessedLabels();
    excelController.save(argv.o);
});



