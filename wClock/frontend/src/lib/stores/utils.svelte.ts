
import { isAlwaysOnTop } from "$lib/stores/sideBarAndTheme.svelte";
import { MakeMiniWindowSize, SetWindowAlwaysOnTop } from "$lib/wailsjs/go/main/App";
import { gofunc } from "$lib/wailsjs/go/models";
import { cards } from "./timerWatch.svelte";
import { get } from 'svelte/store';

export const watchState = $state({
  compact: false
}) 

export function makeMiniWindow(compact: boolean, width: number=200, height: number=180) {
  watchState.compact = compact;
  isAlwaysOnTop.onTop = compact;
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
      TimeLeft: get(c.timeLeft),
      InitialDial: [...c.initialTime] as number[],
    })
  }

  return cardsGo
}