import { get, writable, type Writable } from 'svelte/store';

import type { dialTime, TimerCard } from '$lib/types/StoreComponentsTypes';
import { createWatch } from '../timerWatch.svelte';

export class Card {
  id: string;
  running = $state(false);
  name = $state('');
  time: Writable<dialTime>;
  timer: TimerCard;
  timeLeft: Writable<number>;
  initialTime: dialTime;

  update(name: string, initialT: dialTime, newDial: dialTime) {
    this.name = name;
    this.time.set(newDial);
    this.initialTime = initialT;
    this.timer.updateWatchCard(this.initialTime, this.name);
  }

  constructor(id: string, name: string, initialT: dialTime, t: dialTime, timeleft: number) {
    this.id = id
    this.name = name;
    this.initialTime = initialT;
    this.time = writable(t);
    this.timeLeft = writable(timeleft)
    this.timer = createWatch(this.initialTime, this.time, this.timeLeft, this.name);
  };
};
