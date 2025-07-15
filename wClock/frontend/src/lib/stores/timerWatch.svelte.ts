import { get, writable } from "svelte/store";
import type { Writable } from "svelte/store"
import type { CardType, dialTime } from "$lib/types/StoreComponentsTypes";
import { Card } from "./ClassCard.svelte";

export const cards = writable<CardType[]>([]);

export const createTimer = (t: Writable<dialTime>, initialT: dialTime) => {

  const { subscribe, set, update } = t;
  let idInterval: number;
  let ms: number = 0

  function start() {
    
    let prev = performance.now();
    ms = getMs()

    idInterval = setInterval(() => {
      const now = performance.now();
      const delta = now - prev;
      prev = now;

      ms = Math.max(0, ms - delta);
      const total = Math.floor(ms / 1000);

      if (ms <= 0) {
        stop();
      }

      const newS = total % 10;
      const newS1 = Math.floor((total % 60) / 10);
      const newM = Math.floor((total / 60) % 10);
      const newM1 = Math.floor((total / 60) / 10) % 6;
      const newH = Math.floor(total / 3600) % 10;
      const newH1 = Math.floor(total / 36000);

      update(() => [newH1, newH, newM1, newM, newS1, newS]);

      if (ms <= 0) {
        clearInterval(idInterval);
      }}, 100);
  };
    
  function getMs(): number {
    const [h1, h, m1, m, s1, s] = get(t);
    return (
      (((h1 * 10 + h) * 60 + (m1 * 10 + m)) * 60 + (s1 * 10 + s)) * 1000
    );
  }

  function stop() {
    clearInterval(idInterval);
  };
  
  function reset() {
    stop();
    set(initialT);
  };
  
  return {
    subscribe,
    getMs,
    start,
    stop,
    reset,
  };
};

export function createCard(name: string, t: dialTime) {
  cards.update(c => [...c, new Card(name, t)]);
}

export function updateCard(ind: number, name: string, dial: dialTime) {
  cards.update(c => {
    c[ind].update(name, dial)
    return c
  });
};

export  function deleteCard(id: string) {
  cards.update(c => c.filter(card => card.id !== id));
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