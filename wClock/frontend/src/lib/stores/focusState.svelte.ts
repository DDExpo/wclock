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
  sessionWatchStoped: false,
  sessionIsOnBreak: false,
  isSettingsSide: false,
  seconds: 0,
}); 

export const tasks = writable<TaskType[]>([]);


export const createFocusWatch = (initailTime: number, breaksTime: number, breaksAtMinutes: number, skipBreaks: boolean) => {

  let breaks: number = Math.floor(initailTime / breaksAtMinutes)
  let curTime: number = initailTime * 60 * 1000
  let timeLeft: number = curTime
  let curTask: TaskType | null
  let timeTask: number
  let startTime: number = 0
  let idInterval: number
  let curTaskInd: number | null = null
  let breakIdInterval: number
  let startTaskTime: number = 0
  let lastRecordedMinutes: number = 0;

  function startSession() {

    let startTime = Date.now();
    curTask = getCurTask()

    idInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeLeft = curTime - elapsed;
      const totalMinutes = Math.floor(elapsed / 60000);
  
      const deltaMinutes = totalMinutes - lastRecordedMinutes;
      if (deltaMinutes > 0) {
        appSettings.Focus.goal.completed += deltaMinutes;
        appSettings.Focus.goal.yesterday[1] += Math.floor(deltaMinutes / 60);
        lastRecordedMinutes = totalMinutes;
      };

      if (curTask !== null) {
        if (!curTask.completed){
          const elapsedTask = (Date.now() - startTaskTime)
          curTask.tweenTime.target += (10001/timeTask) * 100
          curTask.timeToSpend = curTask.timeInitToSpend - Math.floor(elapsedTask/60000)
          if (elapsedTask >= timeTask) {
            curTask.completed = true;
            curTask.cuurentTaskSession = false
            notify("/sounds/done-tasks.mp3", "Task", curTask.text);
            curTask = getCurTask();
          }
        }
      };
  
      if (skipBreaks && breaks > 0 && (totalMinutes % breaksAtMinutes) === 0) {
        curTime = timeLeft;
        clearInterval(idInterval);
        const breaks = Math.floor(appSettings.Focus.focus.minutes / (appSettings.Focus.focus.breaksAtEvery*60))+1
        const curBreaks = Math.floor(appSettings.Focus.focus.curMinutes / (appSettings.Focus.focus.breaksAtEvery*60))+1
        notify("/sounds/timer.mp3", "Focus", `Your ${curBreaks}/${breaks} session`);
        focusCardState.sessionIsOnBreak = true;
        startBreak();
      };

      if (timeLeft <= 0) {
        clearInterval(idInterval);
        notify("/sounds/luna.mp3", "Your focus session", "");
      };

  }, 10000);};

  function startBreak() {
    
  const breakStart = Date.now();

  breakIdInterval = setInterval(() => {
    const breakElapsed = Date.now() - breakStart;

    if (breakElapsed >= breaksTime) {
      clearInterval(breakIdInterval);
      notify("/sounds/timer.mp3", "Break", "Your break session");
      breaks -= 1
      startTime += breakElapsed
      focusCardState.sessionIsOnBreak = false
      startSession();
    }
  }, 30000);
}  

  function updateFocusWatch(initailTime: number, breaksTime: number, breaksAtMinutes: number, skipBreaks: boolean) {
    initailTime = initailTime
    breaksTime = breaksTime
    breaksAtMinutes = breaksAtMinutes
    skipBreaks = skipBreaks
    curTime = initailTime * 60 * 1000
    breaks = Math.floor(initailTime / breaksAtMinutes)
  }
  
  function getCurTask(): TaskType | null {
    curTaskInd = null
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
      startTaskTime = Date.now()
      curTasks[curTaskInd].cuurentTaskSession = true
      timeTask = curTasks[curTaskInd].timeInitToSpend * 60 * 1000
      return curTasks[curTaskInd]
    };
  };
  
  function stop() {
    if (curTask !== null) {curTask.cuurentTaskSession = false}
    clearInterval(idInterval)
  };
  function stopBreak() {
    clearInterval(breakIdInterval)
  };

  function notify(sound: string, name: string, description: string) {
    TimerFinished(name, description)
    const audio = new Audio(sound);
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }
  
  return {
    stop,
    stopBreak,
    startBreak,
    startSession,
    updateFocusWatch,
  };
};

const deleteDebounceTasks = debounceDelete(DbDelete, "tasks");

export function createTask() {
  tasks.update(t => [...t, new Task(crypto.randomUUID(), "task", false, 15, 15, 0, false)])
}

export function deleteTask(id: string) {
  isDeleteHappening.yes = true
  deleteDebounceTasks(id)
  tasks.update(t => {return t.filter(task => task.id!== id);});

  isDeleteHappening.yes=false
  setTimeout(() => {}, 150)
  tasks.update(t => t)
}

export const focusWatch = createFocusWatch(0, 0, 0, false)
