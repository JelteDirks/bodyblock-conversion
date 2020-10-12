import path from "path";
import * as fs from "fs";
import * as readline from "readline";
import {processLine} from "./processLine";
import {Regel} from "./Regel";

const testfilepath = path.resolve('test/test_fiddle');
const regels: Regel[] = [];
const counterLineRE = /[0-9]{15,}/;
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
        if (counterLineRE.test(line) && offset === -1) {
            const exec = startSpace.exec(line);
            if (exec !== null) {
                offset = exec[0].lastIndexOf(' ') + 1;
            }
        }
        processLine(line, regels, offset);
    }

    regels.forEach((r: Regel) => {
        r.setOmschrijving();
    });

    console.log(JSON.stringify(regels.filter(e => !!e), null, 4));
})();



