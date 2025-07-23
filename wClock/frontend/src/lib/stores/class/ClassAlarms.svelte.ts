import type { Timer, weekDaysBool } from "$lib/types/StoreComponentsTypes";
import { writable, type Writable } from "svelte/store";
import { createWatchAlarm } from "../alarms.svelte";

export class Alarm {
  id: string;
  timerToAlarm: Timer
  timeToAlarm: Writable<string> = writable(`${0} hours ${0} minutes`)
  text = $state<string>("");
  dial = $state<[number, number, number, number]>([0, 0, 0, 0]);
  enable = $state<boolean>(false);
  weekDays = $state<weekDaysBool>([false, false, false, false, false, false, false]);

  partiaUpdate(enable?: boolean, weekDays?: weekDaysBool) {
    if (enable !== undefined && this.enable !== enable) {
      this.enable = enable;
    }

    if (weekDays !== undefined &&
        JSON.stringify(this.weekDays) !== JSON.stringify(weekDays)) {
      this.weekDays = weekDays;
    }
  }

  update(text: string, dial: [number, number, number, number]) {
    this.text = text;
    this.dial = dial;
    this.timerToAlarm = createWatchAlarm(this.dial, this.text, this.timeToAlarm)
  }
  
  constructor(id: string, text: string, dial: [number, number, number, number], enable: boolean, weekDays: weekDaysBool) {
    this.id = id
    this.text = text
    this.dial = dial
    this.enable = enable
    this.weekDays = weekDays
    this.timerToAlarm = createWatchAlarm(this.dial, this.text, this.timeToAlarm)
  };
};
