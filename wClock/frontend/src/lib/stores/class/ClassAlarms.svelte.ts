import type { weekDaysBool } from "$lib/types/StoreComponentsTypes";

export class Alarm {
  id: string;
  timeToAlarm: number
  text: string = $state("");
  dial: [number, number, number, number] = $state([0, 0, 0, 0]);
  enable = $state(false);
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
    this.dial = dial
    this.timeToAlarm = 0
  }
  
  constructor(id: string, text: string, dial: [number, number, number, number], enable: boolean, weekDays: weekDaysBool) {
    this.id = id
    this.text = text
    this.dial = dial
    this.enable = enable
    this.weekDays = weekDays
    this.timeToAlarm = 0
  };
};
