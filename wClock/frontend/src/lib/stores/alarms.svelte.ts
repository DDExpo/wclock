
import type { AlarmType, weekDaysBool } from "$lib/types/StoreComponentsTypes"
import { DbDelete, TimerFinished } from "$lib/wailsjs/go/main/App";
import { writable, type Writable } from "svelte/store";
import { Alarm } from "./class/ClassAlarms.svelte"

export const alarms = writable<AlarmType[]>([])

export const createWatchAlarm = (dial: [number, number, number, number], alarmText: string, timeToAlarmSetter: Writable<string>, weekDays: weekDaysBool) => {

  let idInterval: number;
  let timers: [number, number] = [-1, -1]

  function start() {

    clearInterval(idInterval)
    getNextDay()

    if (timers[0] === -1) {
      timeToAlarmSetter.set(`${0} hours ${0} minutes`);
      return
    }
    updateTimeToAlarm();
    idInterval = setInterval(updateTimeToAlarm, 30000);
  };

  function updateTimeToAlarm(change: boolean = false) {
    if (timers[0] === -1) {return}
    const target = new Date();
    target.setHours(dial[0] * 10 + dial[1], dial[2] * 10 + dial[3], 0, 0);
    target.setDate(target.getDate() + getDaysUntil(target));
    
    const now = new Date();
    let diffMs = target.getTime() - now.getTime();

    if (diffMs < 0 && change) {
      diffMs = -diffMs
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours === 0 && diffMinutes === 0 && diffMs < 5000) {
      timeToAlarmSetter.set(`${0} hours ${0} minutes`);
      stop();
      TimerFinished("Alarm", alarmText);
      setTimeout(soundNotify, 150);
      getNextDay();
      setTimeout(start, 7000); 
      return;
    }

    timeToAlarmSetter.set(`${diffHours} hours ${diffMinutes} minutes`);
  }

  function soundNotify() {
    const audio = new Audio('/sounds/basic-alarm-ringtone.mp3');
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }

  function getNextDay() {
    const today = new Date().getDay()
    for (let j=today; j < 7+today; j++) {
      const ind = j%7;
      if (weekDays[ind]) {
        timers[0] = ind
        for (let jj=ind; jj < 7+ind; jj++) {
          const index = jj%7;
          if (weekDays[index] && ind !== index) {
            timers[1] = index
            if (timers[0] > timers[1]) {
              [timers[0], timers[1]] = [timers[1], timers[0]];
            }
            return
          }}
        timers[1] = -1
        return
      }};
    timers[0] = -1
    timers[1] = -1
  }

  function getDaysUntil(targetDate: Date) {
    const now = new Date();
    const today = now.getDay();

    if (timers[0] === -1) {
      return 7;
    }
    let nextDay = timers[0];
    let daysUntil = nextDay - today;
    if (daysUntil < 0) {
      daysUntil += 7;
    }
    if (today === timers[0] || today === timers[1]) {
      if (targetDate <= now) {
        if (timers[1] !== -1 && timers[1] !== today) {
          daysUntil = timers[1] - today;
          if (daysUntil < 0) {
            daysUntil += 7;
          }
        } else {
          daysUntil = 7;
        }
      } else {
        daysUntil = 0;
      }
    }
    return daysUntil;
  }

  function updateWatchAlarm(newDial: [number, number, number, number], textAlram: string) {
    alarmText = textAlram
    dial = newDial
    setTimeout(updateTimeToAlarm, 300)
  }

  function stop() {
    clearInterval(idInterval);
    timeToAlarmSetter.set(`${0} hours ${0} minutes`);
  };

  return {
    start,
    stop,
    updateTimeToAlarm,
    updateWatchAlarm,
  };
}

export function createAlarm(text: string, dial: [number, number, number, number], id: string=crypto.randomUUID(), disabled: boolean=false, weekDays: weekDaysBool=[false, false, false, false, false, false, false]) {
  alarms.update(a => [...a, new Alarm(id, text, dial, disabled, weekDays)]);
}

export function updateAlarm(ind: number, text: string, dial: [number, number, number, number]) {
  alarms.update(a => {
    a[ind].update(text, dial);
    return a;
  });
};

export function deleteAlarm(ind: number, id: string) {
  alarms.update(a => {
    a[ind].timerToAlarm.stop()
      return a.filter(alarm => alarm.id !== id);
  });
  DbDelete(id, "alarms")
};