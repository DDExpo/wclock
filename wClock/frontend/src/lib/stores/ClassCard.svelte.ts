import { derived, writable, type Writable } from 'svelte/store';

import type { dialTime, Timer } from '$lib/types/StoreComponentsTypes';
import { createWatch } from './timerWatch.svelte';

export class Card {
  id = crypto.randomUUID();
  running = $state(false);
  isChanged = false;
  name: string;
  time: Writable<dialTime>;
  timer: Timer;
  timeLeft: Writable<number>;
  initialTime: dialTime;

  update(name: string, newDial: dialTime) {
    this.name = name;
    this.time.set(newDial);
    this.timer.reset();
    this.initialTime = newDial;
    this.isChanged = true;

  }
  
  constructor(name: string, t: dialTime) {
    this.name = name;
    this.time = writable(t);
    this.initialTime = t;
    this.timeLeft = writable(0)
    this.timer = createWatch(this.initialTime, this.time, this.timeLeft);
  };
};
