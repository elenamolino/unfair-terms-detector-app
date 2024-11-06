export class Clause {
    constructor(term, ltd, ter, ch, cr, use, law, j, a) {
        this.term = term;
        this.ltd = ltd;
        this.ter = ter;
        this.ch = ch;
        this.cr = cr;
        this.use = use;
        this.law = law;
        this.j = j;
        this.a = a;
    }

    get isUnfair() {
        return this.calcAbusivity();
    }

    calcAbusivity() {
        return this.ltd > 0.5 || this.ter > 0.5 || this.ch > 0.5 ||
            this.cr > 0.5 || this.use > 0.5 || this.law > 0.5 ||
            this.j > 0.5 || this.a > 0.5;
    }
}
