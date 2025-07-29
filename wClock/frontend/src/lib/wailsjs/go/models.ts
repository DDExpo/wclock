export namespace gofunc {
	
	export class Alarm {
	    ID: string;
	    Disabled: boolean;
	    Text: string;
	    Dial: number[];
	    WeekDays: boolean[];
	
	    static createFrom(source: any = {}) {
	        return new Alarm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Disabled = source["Disabled"];
	        this.Text = source["Text"];
	        this.Dial = source["Dial"];
	        this.WeekDays = source["WeekDays"];
	    }
	}
	export class FocusCard {
	    hours: number;
	    minutes: number;
	    breaks: number;
	    breaksTime: number;
	    skipBreaks: boolean;
	
	    static createFrom(source: any = {}) {
	        return new FocusCard(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hours = source["hours"];
	        this.minutes = source["minutes"];
	        this.breaks = source["breaks"];
	        this.breaksTime = source["breaksTime"];
	        this.skipBreaks = source["skipBreaks"];
	    }
	}
	export class Goal {
	    dailyProgress: number[];
	    streak: number;
	    yesterday: number;
	    completed: number;
	    dailyGoal: number;
	    clearHours: number;
	    clearMinutes: number;
	    includeWeekdays: boolean;
	
	    static createFrom(source: any = {}) {
	        return new Goal(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.dailyProgress = source["dailyProgress"];
	        this.streak = source["streak"];
	        this.yesterday = source["yesterday"];
	        this.completed = source["completed"];
	        this.dailyGoal = source["dailyGoal"];
	        this.clearHours = source["clearHours"];
	        this.clearMinutes = source["clearMinutes"];
	        this.includeWeekdays = source["includeWeekdays"];
	    }
	}
	export class FocusSettings {
	    goal: Goal;
	    focus: FocusCard;
	
	    static createFrom(source: any = {}) {
	        return new FocusSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.goal = this.convertValues(source["goal"], Goal);
	        this.focus = this.convertValues(source["focus"], FocusCard);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class AppSettings {
	    Theme: boolean;
	    Focus: FocusSettings;
	
	    static createFrom(source: any = {}) {
	        return new AppSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Theme = source["Theme"];
	        this.Focus = this.convertValues(source["Focus"], FocusSettings);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
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
	
	
	
	export class Task {
	    ID: string;
	    Text: string;
	    Checked: boolean;
	    TimeSpent: string;
	
	    static createFrom(source: any = {}) {
	        return new Task(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ID = source["ID"];
	        this.Text = source["Text"];
	        this.Checked = source["Checked"];
	        this.TimeSpent = source["TimeSpent"];
	    }
	}

}

