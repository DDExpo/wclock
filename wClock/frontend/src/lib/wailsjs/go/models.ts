export namespace gofunc {
	
	export class Card {
	    ID: string;
	    Name: string;
	    Dial: number[];
	    TimeLeft: number;
	    InitialDial: number[];
	
	    static createFrom(source: any = {}) {
	        return new Card(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Name = source["Name"];
	        this.Dial = source["Dial"];
	        this.TimeLeft = source["TimeLeft"];
	        this.InitialDial = source["InitialDial"];
	    }
	}

}

