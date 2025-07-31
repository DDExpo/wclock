import { Tween } from "svelte/motion";
import { cubicOut } from 'svelte/easing';

export class Task {
  id: string;
  text = $state("task");
  order = $state(0)
  checked = $state(false);
  tweenTime: Tween<number> 
  timeToSpend = $state(0);
  timeInitToSpend = $state(0);

  constructor(id: string, text: string, checked: boolean, timeInitToSpend: number, timeToSpend: number, order: number) {
    this.id = id
    this.text = text
    this.order = order 
    this.checked = checked
    this.timeToSpend = timeToSpend
    this.timeInitToSpend = timeInitToSpend;
    this.tweenTime = new Tween(0, {duration: this.timeInitToSpend, easing: cubicOut})
  };
};
