import type { Timer, weekDaysBool } from "$lib/types/StoreComponentsTypes";
import { writable, type Writable } from "svelte/store";
import { createWatchAlarm } from "../alarms.svelte";

export class Alarm {
  id: string;
  text = $state<string>("");
  dial = $state<string>("");
  order: number;
  disabled = $state<boolean>(false);
  weekDays = $state<weekDaysBool>([false, false, false, false, false, false, false]);
  dialNumber: [number, number, number, number];
  timeToAlarm: Writable<string> = writable(`${0} hours ${0} minutes`)
  timerToAlarm: Timer

  update(text: string, dial: [number, number, number, number]) {
    this.text = text;
    this.dial = `${dial[0]}${dial[1]}:${dial[2]}${dial[3]}`;
    this.dialNumber = dial
    this.timerToAlarm.updateWatchAlarm(this.dialNumber, this.text)
  }
  
  constructor(id: string, text: string, dial: [number, number, number, number], disabled: boolean, weekDays: weekDaysBool, order: number) {
    this.id = id
    this.text = text
    this.dial = `${dial[0]}${dial[1]}:${dial[2]}${dial[3]}`
    this.order = order
    this.disabled = disabled
    this.weekDays = weekDays
    this.dialNumber = dial
    this.timerToAlarm = createWatchAlarm(this.dialNumber, this.text, this.timeToAlarm, this.weekDays)
  };
};
