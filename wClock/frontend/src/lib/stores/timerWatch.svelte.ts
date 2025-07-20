import { get, writable } from "svelte/store";

import type { Writable } from "svelte/store"
import type { CardType, dialTime } from "$lib/types/StoreComponentsTypes";

import { Card } from "./ClassCard.svelte";
import { DeleteCard } from "$lib/wailsjs/go/main/App";

export const cards = writable<CardType[]>([]);

export const createWatch = (initialT: dialTime, t: Writable<dialTime>, timeLeft: Writable<number>) => {

  const { subscribe, set, update } = t;
  let idInterval: number;
  let totals: number = 0
  let step: number = 1 / getSumDial()
  
  function start() {
    totals = getSumDial()

    idInterval = setInterval(() => {
      
      if (totals <= 0) {
        stop()
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

  function getSumDial(): number {
    const dial = get(t);
    return ((dial[0] * 10 + dial[1]) * 60 + (dial[2] * 10 + dial[3])) * 60 + (dial[4] * 10 + dial[5]);
  };

  function stop() {
    clearInterval(idInterval);
  };
  
  function reset() {
    stop();
    set(initialT);
    step = 1 / getSumDial();
    timeLeft.set(0);
  };
  
  return {
    start,
    stop,
    reset,
  };
};

export function createCard( name: string, initialT: dialTime, t: dialTime, id: string=crypto.randomUUID(), timeLeft: number=0) {
  cards.update(c => [...c, new Card(id, name, initialT, t, timeLeft)]);
}

export function updateCard(ind: number, name: string, initialT: dialTime, dial: dialTime) {
  cards.update(c => {
    c[ind].update(name, initialT, dial)
    return c
  });
};

export  function deleteCard(id: string) {
  cards.update(c => c.filter(card => card.id !== id));
  DeleteCard(id)
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