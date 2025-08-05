
import { isAlwaysOnTop } from "$lib/stores/sideBarAndTheme.svelte";
import type { AppSettings } from "$lib/types/StoreComponentsTypes";
import { MakeMiniWindowSize, SetWindowAlwaysOnTop } from "$lib/wailsjs/go/main/App";
import { gofunc } from "$lib/wailsjs/go/models";
import { WindowUnfullscreen } from "$lib/wailsjs/runtime/runtime";
import { alarms } from "./alarms.svelte";
import { tasks } from "./focusState.svelte";
import { cards } from "./timerWatch.svelte";
import { get } from 'svelte/store';

export const isDeleteHappening = $state({
  yes: false
})

export const watchState = $state({
  compact: false
}) 

export const appSettings: AppSettings = $state({
  Theme: false,
  Focus: {
    gridSeize: {
      left: 230,
      bottom: 330
    },
    goal: {
      dailyProgress: [0, 0],
      streak: 0,
      yesterday: [0, 0],
      completed: 0,
      dailyGoal: 1,
      clearHours: 12,
      clearMinutes: 30,
      monthDay: [0, 0],
      includeWeekdays: false,
    },
    focus: {
      minutes: 30,
      curMinutes: 0,
      breaksTime: 5,
      skipBreaks: false,
      breaksAtEvery: 1,
    }
  }
});

export function validateSettings(goalCardValidation = false, focusCardValidation = false): boolean {
  let isNotValid = false;

  const clamp = (val: any, max: number, fallback: number): number => {
    const num = Math.floor(Number(val));
    if (isNaN(num) || num < 0 || num > max) {
      isNotValid = true;
      return fallback;
    }
    return num;
  };

  if (goalCardValidation) {
    appSettings.Focus.goal.clearHours = clamp(appSettings.Focus.goal.clearHours, 23, 12);
    appSettings.Focus.goal.clearMinutes = clamp(appSettings.Focus.goal.clearMinutes, 59, 30);
    appSettings.Focus.goal.dailyGoal = clamp(appSettings.Focus.goal.dailyGoal, 24, 6);
    const now = new Date()
    appSettings.Focus.goal.monthDay = [now.getMonth(), now.getDate()]
  }
  
  if (focusCardValidation) {
    appSettings.Focus.focus.minutes = clamp(appSettings.Focus.focus.minutes, 1440, 60);
    appSettings.Focus.focus.breaksTime = clamp(appSettings.Focus.focus.breaksTime, 720, 5);
    appSettings.Focus.focus.breaksAtEvery = clamp(appSettings.Focus.focus.breaksAtEvery, 12, 1);
  }

  return isNotValid;
}

export function makeMiniWindow(compact: boolean, width: number=200, height: number=180) {
  watchState.compact = compact;
  isAlwaysOnTop.onTop = compact;
  WindowUnfullscreen()
  SetWindowAlwaysOnTop(compact);

  if (compact) {MakeMiniWindowSize(width, height, watchState.compact);  
  } else {MakeMiniWindowSize(356, 356, watchState.compact);};
};

export function getCards(): gofunc.Card[] {
  const curCards = get(cards);
  return curCards.map((c) => {
    const dial = get(c.time) as number[];
    return gofunc.Card.createFrom({
      ID: c.id,
      Name: c.name,
      Order: c.order,
      Dial: [...dial],
      TimeLeft: Number(get(c.timeLeft).toFixed(5)),
      InitialDial: [...c.initialTime],
    });
  });
}

export function getAlarms(): gofunc.Alarm[] {
  const curAlarms = get(alarms);
  return curAlarms.map((a) =>
    gofunc.Alarm.createFrom({
      ID: a.id,
      Text: a.text,
      Dial: a.dialNumber,
      Order: a.order,
      WeekDays: a.weekDays,
      Disabled: a.disabled,
    })
  );
}

export function getTasks(): gofunc.Task[] {
  const curTasks = get(tasks);
  return curTasks.map((t) =>
    gofunc.Task.createFrom({
      ID: t.id,
      Text: t.text,
      Order: t.order,
      Checked: t.checked,
      TimeToSpend: t.timeToSpend,
      TimeInitToSpend: Number(t.timeInitToSpend),
      Completed: t.completed,
    })
  );
}

export function debounce(callback: CallableFunction, delay: number=2000) {
  
  let timeoutId: number
  
  return (...args: any[]) => {
    if (isDeleteHappening.yes) return
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)}, delay)
    };
};

export function debounceDelete(callback: (ids: string[], table: string) => void, table: string, delay: number =1000) {
  let timeoutId: number;
  let deleteQueue: string[] = [];
  
  return (id: string) => {
    deleteQueue.push(id);
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(deleteQueue, table);
      deleteQueue = [];
    }, delay);
  };
}
