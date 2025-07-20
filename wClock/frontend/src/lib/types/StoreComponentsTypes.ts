import type { Writable } from "svelte/store"

export interface PropsForm {
  closeForm: () => void
  formName: string;
  cardName?: string;
  cardDial?: dialTime; 
  cardInd?: number;
  change?: boolean;
}

export interface PropsCircleProgress {
  progress?: Writable<number>
  cardTime: Writable<dialTime>;
}

export interface PropsCard {
  card: CardType
  ind: number
}

export type Timer = {
  start: () => void;
  stop: () => void;
  reset: () => void;
};

export type dialTime = [number, number, number, number, number, number]

export type CardType = {
  id: string;
  running: boolean;
  name: string;
  time: Writable<dialTime>;
  timer: Timer;
  timeLeft: Writable<number>;
  initialTime: dialTime;
  update: (name: string, initialT: dialTime, newDial: dialTime) => void;
};

