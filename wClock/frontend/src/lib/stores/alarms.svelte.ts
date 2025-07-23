
import type { AlarmType, weekDaysBool } from "$lib/types/StoreComponentsTypes"
import { DbDelete, TimerFinished } from "$lib/wailsjs/go/main/App";
import { writable, type Writable } from "svelte/store";
import { Alarm } from "./class/ClassAlarms.svelte"

export const alarms = writable<AlarmType[]>([])

export const createWatchAlarm = (dial: [number, number, number, number], alarmText: string, timeToAlarmSetter: Writable<string>) => {

  let idInterval: number;
  let oldNextDay: number;

  function start(curDay: number, nextDay: number) {

    console.log(nextDay, curDay)
    if (nextDay == oldNextDay && idInterval !== undefined) {return};
    clearInterval(idInterval);

    oldNextDay = nextDay

    const now = new Date();
    let daysUntil = nextDay - curDay;

    if (daysUntil == 0) {
      const hour = dial[0] * 10 + dial[1];
      const minute = dial[2] * 10 + dial[3];
      if (hour < now.getHours() || (hour === now.getHours() && minute <= now.getMinutes())) {
        daysUntil = 7;
      }
    } else if (daysUntil < 0) {
      daysUntil += 7;
    }
        
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntil);
    target.setHours(dial[0] * 10 + dial[1], dial[2] * 10 + dial[3], 0, 0);

    function updateTimeToAlarm() {

      const now = new Date();
      const diffMs = target.getTime() - now.getTime();
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      if (diffMs <= 0) {
        stop();
        TimerFinished("Alarm", alarmText);
        setTimeout(soundNotify, 150);
        timeToAlarmSetter.set(`${diffHours} hours ${diffMinutes} minutes`);
        return;
      }
      timeToAlarmSetter.set(`${diffHours} hours ${diffMinutes} minutes`);
    }
    updateTimeToAlarm();
    idInterval = setInterval(updateTimeToAlarm, 1000);
  };

  function soundNotify() {
    const audio = new Audio('/sounds/so-proud-notification.mp3');
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }

  function stop() {
    clearInterval(idInterval);
    timeToAlarmSetter.set(`${0} hours ${0} minutes`);
  };

  return {
    start,
    stop,
  };
}

export function createAlarm(text: string, dial: [number, number, number, number], id: string=crypto.randomUUID(), enable: boolean=false, weekDays: weekDaysBool=[false, false, false, false, false, false, false]) {
  alarms.update(a => [...a, new Alarm(id, text, dial, enable, weekDays)]);
}

export function updateAlarm(ind: number, text: string, dial: [number, number, number, number]) {
  alarms.update(a => {
    a[ind].update(text, dial);
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