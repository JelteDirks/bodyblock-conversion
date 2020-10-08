import {Positie} from "./Positie";
import {anvaInstellingen, GroepInstellingen} from "./ANVAInstellingen";

export class Regel {
    public regelnummer: number;
    public regelTemplate: string;
    public omschrijving: string = '';
    public inhoud: string = '';
    public posities: Positie[] = [];
    private regelInspringen = 3;

    constructor(regelTemplate: string, regelNummer: number) {
        this.regelTemplate = regelTemplate;
        this.regelnummer = regelNummer;
    }

    private getPositie(index: number): Positie {
        for (let pos of this.posities) {
            if (pos.nummer === index) return pos;
        }

        return new Positie();
    }

    private setPositie(index: number, pos: Positie): number {
        for (let i = 0; i < this.posities.length; ++i) {
            if (this.posities[i].nummer === index) {
                this.posities[i] = pos;
                return 1;
            }
        }
        return 0;
    }

    private hasPositie(index: number): boolean {
        for (let pos of this.posities) {
            if (pos.nummer === index) return true;
        }

        return false;
    }

    public processSettings(line: string, regel: number, positie: number): void {
        if (regel !== this.regelnummer) throw 'regelnummer and regel should match';

        // tweede positie op deze regel, omschrijving lengte is bekend
        if (this.posities.length === 1) {
            const eerstePositieStart = this.posities[0].nummer;
            this.omschrijving = this.regelTemplate.substr(
                (this.regelInspringen + eerstePositieStart) - 1,
                (positie - eerstePositieStart)
            );
        }

        for (let ai of anvaInstellingen) {
            const matcher = line.match(ai.value);
            if (!matcher) continue;
            ai.groups.forEach((g: GroepInstellingen) => {
                const pos = this.getPositie(positie);
                // @ts-ignore
                pos.instellingen[g.t] = matcher[g.n];
                this.setPositie(positie, pos);
            });
        }
    }
}