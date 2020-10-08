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

    private voegPositieToe(index: number): void {
        this.posities.push(new Positie(index));
    }

    private getPositie(index: number): Positie {
        if (!this.hasPositie(index)) {
            this.voegPositieToe(index);
        }

        return this.posities[this.posities.length - 1];
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
            ).trim();
        }

        if (!this.hasPositie(positie)) this.voegPositieToe(positie);

        // zoek naar instellingen voor bijbehoredne positie
        for (let ai of anvaInstellingen) {
            const matcher = line.match(ai.value);
            if (!matcher) continue;
            ai.groups.forEach((g: GroepInstellingen) => {
                // @ts-ignore
                this.getPositie(positie).instellingen[g.t] = matcher[g.n]
            });
        }
    }
}