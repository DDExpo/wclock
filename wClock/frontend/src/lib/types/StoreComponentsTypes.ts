import type { Tween } from "svelte/motion";
import type { Writable } from "svelte/store"

export interface PropsForm {
  closeForm: () => void
  ind?: number;
  Text?: string;
  Dial?: dialTime; 
  alarm?: boolean;
  change?: boolean;
  formName: string;
  digitsLen?: number;
}

export interface PropsCircleProgress {
  goal?: number
  time?: Writable<dialTime>;
  focus?: boolean;
  progress?: Writable<number>
}

export interface PropsAlarm {
  alarm: AlarmType
  timeTo: Writable<string>
  alarmInd: number
}

export interface PropsCard {
  card: CardType
  cardInd: number
}

export type Timer = {
  stop: () => void;
  start: () => void;
  updateWatchAlarm: (newDial: [number, number, number, number], textAlarm: string) => void;
  updateTimeToAlarm: (change: boolean) => void;
};

export type TimerCard = {
  stop: () => void;
  start: () => void;
  reset: () => void;
  updateWatchCard: (initialT: dialTime, timerName: string) => void;
};

export type dialTime = [number, number, number, number, number, number]

export type weekDaysBool = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

export type AppSettings = {
  Theme: boolean
  Focus: {
    goal: {
      streak: number
      monthDay: [number, number]
      yesterday: number
      completed: number
      dailyGoal: number
      clearHours: number
      clearMinutes: number
      dailyProgress: [number, number]
      includeWeekdays: boolean
    }
    focus: {
      breaks: number
      minutes: number
      breaksTime: number
      skipBreaks: boolean
    }
  }
}

export type TaskType = {
  id: string;
  text: string;
  order: number;
  checked: boolean;
  tweenTime: Tween<number>
  timeToSpend: number;
  timeInitToSpend: number;
};

export type AlarmType = {
  id: string;
  text: string;
  dial: string;
  order: number;
  disabled: boolean;
  weekDays: weekDaysBool;
  dialNumber: [number, number, number, number];
  timeToAlarm: Writable<string>;
  timerToAlarm: Timer;
  update: (text: string, dial: [number, number, number, number]) => void;
};

export type CardType = {
  id: string;
  name: string;
  order: number;
  time: Writable<dialTime>;
  timer: TimerCard;
  running: boolean;
  timeLeft: Writable<number>;
  initialTime: dialTime;
  update: (name: string, initialT: dialTime, newDial: dialTime) => void;
};

