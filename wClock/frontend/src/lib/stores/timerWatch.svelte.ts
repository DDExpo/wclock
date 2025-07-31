import { get, writable } from "svelte/store";

import type { Writable } from "svelte/store"
import type { CardType, dialTime } from "$lib/types/StoreComponentsTypes";

import { Card } from "$lib/stores/class/ClassCard.svelte";
import { DbDelete, TimerFinished } from "$lib/wailsjs/go/main/App";
import { debounceDelete, isDeleteHappening } from "./utils.svelte";

export const cards = writable<CardType[]>([]);
export const notDraggable = $state({ dragg: false})

export const createWatch = (initialT: dialTime, t: Writable<dialTime>, timeLeft: Writable<number>, timerName: string) => {

  const { subscribe, set, update } = t;
  let idInterval: number;
  let totals: number = 0
  let step: number = 1 / (((initialT[0] * 10 + initialT[1]) * 60 + (initialT[2] * 10 + initialT[3])) * 60 + (initialT[4] * 10 + initialT[5]));
  let name: string = timerName
  
  function start() {
    const dial = get(t)
    totals = (((dial[0] * 10 + dial[1]) * 60 + (dial[2] * 10 + dial[3])) * 60 + (dial[4] * 10 + dial[5]));

    idInterval = setInterval(() => {
      
      
      if (totals <= 0) {
        stop()
        TimerFinished("Timer", name)
        setTimeout(soundNotify, 150); 
        return
      };
      totals--
      
      const s = totals % 10
      const s1 = Math.floor((totals % 60) / 10);
      const m = Math.floor((totals / 60) % 10);
      const m1 = Math.floor((totals / 60) / 10) % 6;
      const h = Math.floor(totals / 3600) % 10;
      const h1 = Math.floor(totals / 36000);
      
      update(() => [h1, h, m1, m, s1, s])
      timeLeft.update((tleft => tleft += step))

    }, 1000);
  };

  function soundNotify() {
    const audio = new Audio('/sounds/so-proud-notification.mp3');
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }

  function updateWatchCard(initialTimer: dialTime, timerName: string) {
    step = 1 / (((initialTimer[0] * 10 + initialTimer[1]) * 60 + (initialTimer[2] * 10 + initialTimer[3])) * 60 + (initialTimer[4] * 10 + initialTimer[5]));
    name  = timerName
    initialT = initialTimer
    t.set(initialTimer)
  }

  function stop() {
    clearInterval(idInterval);
  };
  
  function reset() {
    stop();
    set(initialT);
    step = 1 / (((initialT[0] * 10 + initialT[1]) * 60 + (initialT[2] * 10 + initialT[3])) * 60 + (initialT[4] * 10 + initialT[5]));
    timeLeft.set(0);
  };
  
  return {
    start,
    stop,
    reset,
    updateWatchCard,
  };
};

export function createCard( name: string, initialT: dialTime, t: dialTime, id: string=crypto.randomUUID(), timeLeft: number=0) {
  cards.update(c => [...c, new Card(id, name, initialT, t, timeLeft, c.length+1)]);
}

export function updateCard(ind: number, name: string, initialT: dialTime, dial: dialTime) {
  cards.update(c => {
    c[ind].timer.stop()
    c[ind].update(name, initialT, dial)
    return c});
};

const deleteDebounceCards = debounceDelete(DbDelete, "cards");

export  function deleteCard(ind: number, id: string) {
  isDeleteHappening.yes = true

  deleteDebounceCards(id)
  cards.update(c => {
    c[ind].timer.reset();
    return c.filter(card => card.id !== id);
  });
  
  setTimeout(() => isDeleteHappening.yes=false, 50)
};

export function validateDial(cardDial: number[]): boolean {

  let sum = 0
  for (let i = 0; i < cardDial.length; i++) {
    const digit = cardDial[i];
    sum += digit
    if (digit == null || digit < 0) return false;
    if ((i === 2 || i === 4) && digit > 5) return false;
    if (!(i === 2 || i === 4) && digit > 9) return false;
  }
  if (sum == 0) return false
  return true
};