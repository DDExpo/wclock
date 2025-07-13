import { writable } from "svelte/store";

export type Timer = {
    start: () => void;
    stop: () => void;
    reset: () => void;
  };

type Card = {
  id: string;
  compact: boolean;
  running: boolean;
  name: string;
  time: number;
  timeLeft: number;
  timer: Timer;
};

export const cards = $state<Card[]>([]);

const createTimer = () => {
  const { subscribe, set, update } = writable({ h: 0, h1: 0, m: 0, m1: 0, s: 0, s1: 0, ms1: 0, ms: 0});
  
  let idInterval: number;
  
  function start() {
    
    let prev = performance.now();
    idInterval = setInterval(() => {
      const now = performance.now();
      const delta = now - prev;
      prev = now
      
      update(t => {
        let ms = Math.floor(t.ms + delta);
        let ms1 = ms % 100 
        let s = t.s;
        let m = t.m;
        let h = t.h;
        let s1 = t.s1;
        let m1 = t.m1;
        let h1 = t.h1
        
        if (ms >= 1000) {
          s += 1;
          ms %= 1000;
        };
        if (s >= 10) {
          s1 += 1
          s %= 10
        };
        if (s1 >= 6) {
          m += 1;
          s1 %= 6;
        };
        if (m >= 10) {
          m1 += 1
          m %= 10
        }
        if (m1 >= 6) {
          h += 1;
          m1 %= 6;
        };
        if (h >= 10) {
          h1 += 1
          h %= 10
        }
        return {h, h1, m, m1, s, s1, ms1, ms}});
      }, 100);
    };
    
    function stop() {
      clearInterval(idInterval);
    }
    
    function reset() {
      stop();
      set({ h: 0, h1: 0, m: 0, m1: 0, s: 0, s1: 0, ms1: 0, ms: 0 });
    }
    
    return {
      start,
      stop,
      reset,
    };
  };

export function createCard() {
  cards.push({
    id: crypto.randomUUID(),
    compact: false,
    running: false,
    name: "",
    time: 0,
    timeLeft: 0,
    timer: createTimer(),
  })
};
