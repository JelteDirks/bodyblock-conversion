import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {processLine} from "./processLine";
import {Regel} from "./Regel";

const testfilepath = path.resolve('test/FML0200002');
const regels: Regel[]= [];

(async function () {
    const filestream = fs.createReadStream(testfilepath, {
        encoding: "latin1"
    });

    const rlInterface = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    for await (const line of rlInterface) {
        processLine(line, regels);
    }

    console.log(regels.filter(e => !!e));
})();



