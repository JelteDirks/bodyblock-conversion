import {Instellingen} from "./ANVAInstellingen";

export class Positie {
    public type: string = '';
    public nummer: number;
    public labelNummer?: string;
    public instellingen: Instellingen = {};


    constructor(nummer: number) {
        this.nummer = nummer;
    }
}