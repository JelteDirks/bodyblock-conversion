import yargs from "yargs";
import * as fs from "fs";
import path from "path";
import readline from "readline";

const argv = yargs(process.argv.slice(2)).options({
    r: {
        type: 'string',
        demandOption: true,
        description: 'regex for finding file names',
        alias: 'regex'
    },
    d: {
        type: 'string',
        demandOption: true,
        description: 'directory to search',
        alias: 'directory'
    }
}).argv;

console.log(`looking for regex ${argv.r} in ${argv.d}`);

const files = fs.readdirSync(argv.d);

files.forEach(async (file: string) => {
    if (/DS_Store/.test(file)) return;

    let resolvedFilePath = path.resolve(path.join(argv.d, file));

    const filestream = fs.createReadStream(resolvedFilePath, {
        encoding: "latin1"
    });

    const rlInterface = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    const re = new RegExp(argv.r);

    for await (const line of rlInterface) {
        if (re.test(line)) {
            console.log(resolvedFilePath);
            return;
        }
    }
});
