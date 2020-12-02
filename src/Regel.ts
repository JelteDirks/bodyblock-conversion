import {Positie} from "./Positie";
import {anvaInstellingen, GroepInstellingen} from "./ANVAInstellingen";
import {translateCharacters} from "./translateCharacters";

export class Regel {
    public regelnummer: number;
    public regelTemplate: string;
    public omschrijving: string = 'n/a';
    public inhoud: string = '';
    public posities: Positie[] = [];
    public processed: boolean = false;
    private offset: number;
    private positiesSorted: boolean = false;
    private exceptionHandled: boolean = false;

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

    public sortPosities(): void {
        if (this.positiesSorted) return;

        this.posities.sort((a: Positie, b: Positie) => {

            if (a.nummer < b.nummer) return -1;
            if (a.nummer === b.nummer) return 0;

            return 1;
        });

        this.positiesSorted = true;
    }

    public handleExceptions(): boolean {
        if (this.exceptionHandled) return true;

        this.sortPosities();

        const labelsOnly = this.posities.every(e => {
            return !!e.instellingen.labelnummer;
        });

        if (/\d{2}(\s|\^)*$/.test(this.regelTemplate)) {

            this.fillTemplateWithLabels()

            this.inhoud = this.regelTemplate.replace(/\b[0-9]{2}\b/, '').trim();
            this.exceptionHandled = true;
            return true;
        }

        if (/^\d{2}(\W|\^)*$/.test(this.regelTemplate)) {
            this.fillTemplateWithLabels()

            this.inhoud = this.regelTemplate.replace(/^\d{2}\s?/, '').trim();
            this.exceptionHandled = true;
            return true;
        }

        if (/^\d{2}\s*.*/.test(this.regelTemplate) && (this.posities.length === 1) && (Object.keys(this.posities[0].instellingen).length === 0)) {
            this.inhoud = this.regelTemplate.replace(/^\d{2}\s?/, '').trim();
            this.exceptionHandled = true;
            return true;
        }

        if (labelsOnly) {
            this.fillTemplateWithLabels();

            this.inhoud = this.regelTemplate.replace(/^\d{2}\s?/, '').trim();

            this.posities.forEach((pos: Positie) => {
                if (!pos.instellingen.labelnummer) throw 'no labelnummer found, this is not possible here';
            });
            this.exceptionHandled = true;

            return true;
        }

        return false;
    }

    private fillTemplateWithLabels(): void {
        this.posities.forEach((pos: Positie) => {
            if (pos.instellingen.labelnummer) {
                this.regelTemplate = this.regelTemplate.replace('^', pos.instellingen.labelnummer);
                this.inhoud = this.inhoud.replace('^', pos.instellingen.labelnummer);
            }
        });
    }

    public setInhoudLabels(): void {
        this.posities.forEach((pos: Positie) => {
            if (!pos.instellingen.hasOwnProperty('labelnummer')) return;
            this.inhoud = this.inhoud.replace('^', <string>pos.instellingen.labelnummer);
        });
    }

    public setInhoud(): void {
        const second = this.posities[1];

        if (!second) {
            console.warn('only one position');
            return;
        }

        this.inhoud = this.regelTemplate.substr(this.offset + second.nummer - 1);
    }

    public setOmschrijving(): void {
        const first = this.posities[0]
        const second = this.posities[1];

        if (!first || !second) {
            console.warn('problem setting omschrijving - first position:', first, 'second position:', second);
            console.warn('at:', this);
            return;
        }

        const eerstePositieStart = first.nummer;
        this.omschrijving = this.regelTemplate.substr(
            (this.offset + eerstePositieStart) - 1,
            (second.nummer - eerstePositieStart)
        ).trim();
    }

    public setTemplateLabels(): void {
        this.posities.forEach((pos: Positie) => {
            if (pos.instellingen.labelnummer) {
                this.regelTemplate = this.regelTemplate.replace('^', pos.instellingen.labelnummer);
            }
        });
    }

    public translateCharacters() {
        this.inhoud = translateCharacters(this.inhoud);
        this.omschrijving = translateCharacters(this.omschrijving);
        this.regelTemplate = translateCharacters(this.regelTemplate);
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
