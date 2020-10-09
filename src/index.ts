import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {processLine} from "./processLine";
import {Regel} from "./Regel";

const testfilepath = path.resolve('test/test_fiddle');
const regels: Regel[]= [];
const counterLineRE = /[0-9]{15,}/;

(async function () {
    const filestream = fs.createReadStream(testfilepath, {
        encoding: "latin1"
    });

    const rlInterface = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    for await (const line of rlInterface) {
        if (counterLineRE.test(line)) {
            console.log(line);
        }
        processLine(line, regels);
    }

    console.log(JSON.stringify(regels.filter(e => !!e), null, 4));
})();



