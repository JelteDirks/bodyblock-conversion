import {Positie} from "./Positie";

export class Regel {
    public regelnummer: number = -1;
    public regelTemplate: string = '';
    public omschrijving: string = '';
    public posities: Positie[] = [];
}