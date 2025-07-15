import { writable, type Writable } from 'svelte/store';

import type { dialTime, Timer } from '$lib/types/StoreComponentsTypes';
import { createTimer } from './timerWatch.svelte';

export class Card {
  id = crypto.randomUUID();
  running = $state(false);
  name: string;
  time: Writable<dialTime>;
  timer: Timer;
  timeLeft: number;
  initialTime: dialTime;

  update(name: string, newDial: dialTime) {
    this.name = name;
    this.time.set(newDial);
    this.timer.reset();
    this.initialTime = newDial;
  }
  
  constructor(name: string, t: dialTime) {
    this.name = name;
    this.time = writable(t);
    this.initialTime = t;
    this.timer = createTimer(this.time, this.initialTime);
    this.timeLeft = 100;
  };
};
