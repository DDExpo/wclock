import { Tween } from "svelte/motion";
import { cubicOut } from 'svelte/easing';

export class Task {
  id: string;
  text = $state("task");
  order = $state(0)
  checked = $state(false);
  completed = $state(false);
  tweenTime: Tween<number> 
  timeToSpend = $state(0);
  timeInitToSpend = $state(0);
  cuurentTaskSession = $state(false);


  constructor(id: string, text: string, checked: boolean, timeToSpend: number, timeInitToSpend:  number, order: number, completed: boolean) {
    this.id = id
    this.text = text
    this.order = order 
    this.checked = checked
    this.tweenTime = new Tween(0, {easing: cubicOut})
    this.timeToSpend = timeToSpend
    this.completed = completed
    this.timeInitToSpend = timeInitToSpend;
  };
};
