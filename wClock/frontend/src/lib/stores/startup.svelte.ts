import type { dialTime, weekDaysBool } from "$lib/types/StoreComponentsTypes";

import { DBGet } from "$lib/wailsjs/go/main/App";
import { alarms } from "$lib/stores/alarms.svelte";
import { cards } from "$lib/stores/timerWatch.svelte";
import { Card } from "$lib/stores/class/ClassCard.svelte";
import { Task } from "$lib/stores/class/ClassTask.svelte";
import { Alarm } from "$lib/stores/class/ClassAlarms.svelte";
import { tasks, tasksState } from '$lib/stores/focusState.svelte';

export async function loadStartupData(isPastClearDate: boolean) {
  const [cardsGo, alarmsGo, tasksGo] = await Promise.all([DBGet("cards"),DBGet("alarms"),DBGet("tasks")])
  
  cards.set(cardsGo.Cards.map(card =>
  new Card(card.ID, card.Name, card.InitialDial as dialTime, card.Dial as dialTime, card.TimeLeft, card.Order)));
  
  alarms.set(alarmsGo.Alarms.map(alarmData => {
    const alarm = new Alarm(alarmData.ID, alarmData.Text, alarmData.Dial as [number, number, number, number], alarmData.Disabled, alarmData.WeekDays as weekDaysBool, alarmData.Order);
    if (!alarm.disabled) {alarm.timerToAlarm.start()};
    return alarm;
  }));
    
  tasks.set(tasksGo.Tasks.map((taskData, ind) => {
    const task = new Task(taskData.ID, taskData.Text, taskData.Checked, taskData.TimeToSpend, taskData.TimeInitToSpend, taskData.Order, taskData.Completed);
    if (task.timeToSpend < task.timeInitToSpend) {task.tweenTime.set(((task.timeInitToSpend-task.timeToSpend)/task.timeInitToSpend)*100)}
    if (isPastClearDate) { task.checked=false, task.timeToSpend=task.timeInitToSpend, task.order=0, task.completed=false, task.tweenTime.set(0)};
    if (task.checked) {tasksState.countChecked += 1, tasksState.checkedIndex.add(ind)};
    if (task.completed) {task.tweenTime.set(100);};
    return task;
  }));    

 }