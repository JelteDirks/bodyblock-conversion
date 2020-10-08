import {Instellingen} from "./ANVAInstellingen";

export class Positie {
    public type: string = '';
    public nummer: number = -1;
    public labelNummer?: string;
    public instellingen: Instellingen = {};
}