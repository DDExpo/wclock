
import type { AlarmType, weekDaysBool } from "$lib/types/StoreComponentsTypes"
import { DbDelete } from "$lib/wailsjs/go/main/App";
import { writable } from "svelte/store";
import { Alarm } from "./class/ClassAlarms.svelte"

export const alarms = writable<AlarmType[]>([])

export function createAlarm(text: string, dial: [number, number, number, number], id: string=crypto.randomUUID(), enable: boolean=false, weekDays: weekDaysBool=[false, false, false, false, false, false, false]) {
  alarms.update(a => [...a, new Alarm(id, text, dial, enable, weekDays)]);
}

export function updateAlarm(ind: number, text: string, dial: [number, number, number, number]) {
  alarms.update(a => {
    a[ind].update(text, dial, 0);
    return a;
  });
};

export function partiaUpdateAlarm(ind: number, enable?: boolean, weekDays?: weekDaysBool) {
  alarms.update(a => {
    a[ind].partiaUpdate(enable, weekDays);
    return a;
  });
};

export function deleteAlarm(id: string) {
  alarms.update(a => a.filter(alarm => alarm.id !== id));
  DbDelete(id, "alarms")
};