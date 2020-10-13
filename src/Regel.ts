import {Positie} from "./Positie";
import {anvaInstellingen, GroepInstellingen} from "./ANVAInstellingen";
import {translateCharacters} from "./translateCharacters";

export class Regel {
    public regelnummer: number;
    public regelTemplate: string;
    public omschrijving: string = '';
    public inhoud: string = '';
    public posities: Positie[] = [];
    private offset: number;
    private positiesSorted: boolean = false;

    constructor(regelTemplate: string, regelNummer: number, offset: number) {
        this.regelTemplate = regelTemplate;
        this.regelnummer = regelNummer;
        this.offset = offset;
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

    private sortPosities(): void {
        if (this.positiesSorted) return;

        this.posities.sort((a: Positie, b: Positie) => {

            if (a.nummer < b.nummer) return -1;
            if (a.nummer === b.nummer) return 0;

            return 1;
        });

        this.positiesSorted = true;
    }

    public setInhoudLabels(): void {
        this.sortPosities();
        this.posities.forEach((pos: Positie) => {
            if (!pos.instellingen.hasOwnProperty('labelnummer')) return;
            this.inhoud = this.inhoud.replace('^', <string>pos.instellingen.labelnummer);
        });
    }

    public setInhoud(): void {
        this.sortPosities();

        const second = this.posities[1];

        if (!second) {
            console.warn('only one position');
            return;
        }

        this.inhoud = this.regelTemplate.substr(this.offset + second.nummer - 1);
        this.inhoud = translateCharacters(this.inhoud);
    }

    public setOmschrijving(): void {
        this.sortPosities();

        const first = this.posities[0]
        const second = this.posities[1];

        if (!first || !second) {
            console.warn('problem setting omschrijving - first position:', first, 'second position:', second);
            return;
        }

        const eerstePositieStart = first.nummer;
        this.omschrijving = this.regelTemplate.substr(
            (this.offset + eerstePositieStart) - 1,
            (second.nummer - eerstePositieStart)
        ).trim();
    }

    public processSettings(line: string, regel: number, positie: number): void {
        if (regel !== this.regelnummer) throw 'regelnummer and regel should match';
        if (!this.hasPositie(positie)) this.voegPositieToe(positie);

        // zoek naar instellingen voor bijbehorende positie
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