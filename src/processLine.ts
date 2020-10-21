import {Regel} from "./Regel";

export class LineProcessor {

    private huidigeRegel: number;
    private huidigePositie: number;

    constructor() {
        this.huidigePositie = -1;
        this.huidigeRegel = -1;
    }

    processLine(line: string, regels: Regel[], offset: number) {

        // regex voor de initiële regels op te slaan
        const regelRE = /^([0-9]{2})\s.+/;
        if (regelRE.test(line)) {
            const groups = line.match(regelRE);
            if (!groups) throw 'no group found while matching regel';
            regels[Number(groups[1])] = new Regel(line, Number(groups[1]), offset);
            return;
        }

        // zoek uit in welke regel en op welke positie de huidige line.
        const regelPositieRE = /^Regel\s+([0-9]+)\s+Positie\s+([0-9]*).*/;
        if (regelPositieRE.test(line)) {
            const groups = line.match(regelPositieRE);

            if (!groups) throw 'no groups found while matching regex of regel & position';

            if (groups[1] === '') throw 'no regel found';

            if (groups[2] === '') throw 'no position found';

            this.huidigeRegel = Number(groups[1]);
            this.huidigePositie = Number(groups[2]);
        }

        if ((this.huidigeRegel > 0) && (this.huidigePositie > 0)) {
            regels[this.huidigeRegel].processSettings(line, this.huidigeRegel, this.huidigePositie);
        }
    }
}
