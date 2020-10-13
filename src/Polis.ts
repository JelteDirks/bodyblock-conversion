import {Regel} from "./Regel";

export class Polis {
    public maatschappij: string = '';
    public branche: string = '';
    public hoofdbranche: string = '';
    public regels: Regel[] = [];

    constructor() {
    }
}