import type { Writable } from "svelte/store"

export interface PropsForm {
  closeForm: () => void
  formName: string;
  Text?: string;
  Dial?: dialTime; 
  ind?: number;
  digitsLen?: number;
  change?: boolean;
  alarm?: boolean;
}

export interface PropsCircleProgress {
  progress?: Writable<number>
  cardTime: Writable<dialTime>;
}

export interface PropsAlarm {
  alarm: AlarmType
  alarmInd: number
  timeTo: Writable<string>
}

export interface PropsCard {
  card: CardType
  cardInd: number
}

export type Timer = {
  start: (curDay: number, nextDay: number) => void;
  stop: () => void;
};

export type TimerCard = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export type dialTime = [number, number, number, number, number, number]

export type weekDaysBool = [boolean, boolean, boolean, boolean, boolean, boolean, boolean]

export type AlarmType = {
  id: string;
  text: string;
  timerToAlarm: Timer;
  timeToAlarm: Writable<string>;
  dial: string;
  dialNumber: [number, number, number, number];
  enable: boolean;
  weekDays: weekDaysBool;
  update: (text: string, dial: [number, number, number, number]) => void;
  partiaUpdate: (enable?: boolean, weekDays?: weekDaysBool) => void
};

export type CardType = {
  id: string;
  running: boolean;
  name: string;
  time: Writable<dialTime>;
  timer: TimerCard;
  timeLeft: Writable<number>;
  initialTime: dialTime;
  update: (name: string, initialT: dialTime, newDial: dialTime) => void;
};

