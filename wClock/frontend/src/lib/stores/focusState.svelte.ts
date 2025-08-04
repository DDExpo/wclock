import { get, writable } from "svelte/store";

import Goal from "$lib/components/focus/Goal.svelte";
import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";

import type { TaskType } from "$lib/types/StoreComponentsTypes";

import { Task } from "./class/ClassTask.svelte";
import { DbDelete, TimerFinished } from "$lib/wailsjs/go/main/App";
import { appSettings, debounceDelete, isDeleteHappening } from "./utils.svelte";

export const focusComponents = writable(
  [{id: 10, componenet: Focus}, {id: 20, componenet: Tasks}, {id: 30, componenet: Goal}]
);

export const tasksState = $state({
  progress: 0,
  countChecked: 0,
  checkedIndex: new Set<number>(),
});

export const goalCardState = $state({
  dailyGoal: 8,
  clearHour: 12,
  clearMinute: 0,
  isFlipped: false,
  includeWeekends: false,
});

export const focusCardState = $state({
  sessionStarted: false,
  sessionIsOnBreak: false,
  isSettingsSide: false,
}); 

export const tasks = writable<TaskType[]>([]);


export const createFocusWatch = (initailTime: number, breaksTime: number, breaksAt: number, skipBreaks: boolean) => {

  let sound: string = "/sounds/timer.mp3"
  let breaks: number = Math.floor(initailTime / breaksAt)
  let curTime: number = initailTime * 60 * 1000
  let curTask: TaskType | null
  let timeTask: number
  let startTime: number = 0
  let idInterval: number
  let curTaskInd: number | null = null
  let breakIdInterval: number
  let lastRecordedMinutes: number = 0;

  function startSession() {

    let startTime = Date.now();

    curTask = getCurTask()    
    idInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeLeft = curTime - elapsed;
      const minutes = Math.floor(timeLeft / 60000);
      const hours = Math.floor(minutes / 60);
      
      if (curTask !== null) {
        curTask.tweenTime.set((elapsed / timeTask) * 100)
        curTask.timeToSpend = minutes
        if (elapsed > timeTask) {
          curTask.completed = true;
          curTask = getCurTask();
        }};
      if (skipBreaks && breaks > 0 && (minutes % breaksAt) === 0) {
        curTime = timeLeft;
        clearInterval(idInterval);
        notify("/sounds/timer.mp3");
        focusCardState.sessionIsOnBreak = true;
        startBreak();
      };

      const deltaMinutes = minutes - lastRecordedMinutes;
      if (deltaMinutes > 0) {
        appSettings.Focus.goal.completed += deltaMinutes;
        appSettings.Focus.goal.yesterday[1] += Math.floor(deltaMinutes / 60);
        lastRecordedMinutes = minutes;
      };
      appSettings.Focus.focus.curMinutes = minutes;

      if (curTime <= 0) {
        clearInterval(idInterval);
        notify("/sounds/luna.mp3");
      };
  }, 30000);};

  function startBreak() {
    
  const breakStart = Date.now();

  breakIdInterval = setInterval(() => {
    const breakElapsed = Date.now() - breakStart;

    if (breakElapsed >= breaksTime) {
      clearInterval(breakIdInterval);
      notify("/sounds/timer.mp3")
      breaks -= 1
      startTime += breakElapsed
      focusCardState.sessionIsOnBreak = false
      startSession();
    }
  }, 30000);
}  

  function updateFocusWatch(initailTime: number, breaksTime: number, breaksAt: number, skipBreaks: boolean) {
    initailTime = initailTime
    breaksTime = breaksTime
    breaksAt = breaksAt
    skipBreaks = skipBreaks
    curTime = initailTime * 60 * 1000
    breaks = Math.floor(initailTime / breaksAt)
  }
  
  function getCurTask(): TaskType | null {
    const curTasks = get(tasks)
    let curMin: number = Infinity

    tasksState.checkedIndex.forEach(ind => {
      const task = curTasks[ind];
      if (task.checked && !task.completed && task.order < curMin) {
        curMin = task.order;
        curTaskInd = ind;
      }});

    if (curTaskInd === null) return null;
    else {
      timeTask = curTasks[curTaskInd].timeInitToSpend * 60 * 1000
      return curTasks[curTaskInd]
    };
  };
  
  function stop() {clearInterval(idInterval)};
  function stopBreak() {clearInterval(breakIdInterval)};

  function notify(sound: string) {
    TimerFinished("Focus Session", "Your session ")
    const audio = new Audio(sound);
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }
  
  return {
    stop,
    stopBreak,
    startSession,
    updateFocusWatch,
  };
};

const deleteDebounceTasks = debounceDelete(DbDelete, "tasks");

export function createTask() {
  tasks.update(t => [...t, new Task(crypto.randomUUID(), "task", false, 15, 15, 0)])
}

export function deleteTask(id: string) {
  isDeleteHappening.yes = true
  deleteDebounceTasks(id)
  tasks.update(t => {return t.filter(task => task.id!== id);});

  setTimeout(() => isDeleteHappening.yes=false, 250)
}

export const focusWatch = createFocusWatch(appSettings.Focus.focus.minutes, appSettings.Focus.focus.breaksTime,
                                           appSettings.Focus.focus.breaksAtEvery, appSettings.Focus.focus.skipBreaks)