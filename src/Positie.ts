import {Instellingen} from "./ANVAInstellingen";

export class Positie {
    public nummer: number;
    public instellingen: Instellingen = {};

    constructor(nummer: number) {
        this.nummer = nummer;
    }
}