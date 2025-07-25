
import { isAlwaysOnTop } from "$lib/stores/sideBarAndTheme.svelte";
import { MakeMiniWindowSize, SetWindowAlwaysOnTop } from "$lib/wailsjs/go/main/App";
import { gofunc } from "$lib/wailsjs/go/models";
import { WindowUnfullscreen } from "$lib/wailsjs/runtime/runtime";
import { alarms } from "./alarms.svelte";
import { cards } from "./timerWatch.svelte";
import { get } from 'svelte/store';

export const watchState = $state({
  compact: false
}) 

export function makeMiniWindow(compact: boolean, width: number=200, height: number=180) {
  watchState.compact = compact;
  isAlwaysOnTop.onTop = compact;
  WindowUnfullscreen()
  SetWindowAlwaysOnTop(compact);

  if (compact) {MakeMiniWindowSize(width, height, watchState.compact);  
  } else {MakeMiniWindowSize(356, 356, watchState.compact);};
};

export function getCards(): gofunc.Card[] {
  var cardsGo: gofunc.Card[] = []
  var curCards = get(cards)
  for (const c of curCards) {
    const dial = get(c.time) as number[]
    cardsGo.push({
      ID: c.id,
      Name: c.name,
      Dial: [...dial],
      TimeLeft: Number(get(c.timeLeft).toFixed(3)),
      InitialDial: [...c.initialTime] as number[],
    })
  }
  return cardsGo
}

export function getAlarms(): gofunc.Alarm[] {
  var curAlarms = get(alarms)
  return curAlarms.map((a) => ({
    ID: a.id,
    Enable: a.enable,
    Text: a.text,
    Dial: a.dialNumber as number[],
    WeekDays: a.weekDays as boolean[],
  }));
}

export function debounce(callback: CallableFunction, delay: number=2000) {
  let timeoutId: number

  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)}, delay)
    };
};