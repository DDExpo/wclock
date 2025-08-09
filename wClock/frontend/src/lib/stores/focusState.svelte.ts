import { get, writable } from "svelte/store";

import Goal from "$lib/components/focus/Goal.svelte";
import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";

import type { TaskType } from "$lib/types/StoreComponentsTypes";

import { Task } from "./class/ClassTask.svelte";
import { DbDelete, TimerFinished } from "$lib/wailsjs/go/main/App";
import { appSettings, debounceDelete, isDeleteHappening } from "./utils.svelte";

const tenSecondsAsMinutes: number = 0.1667  // 10 seconds and 2 ms
const breaksTotal = $derived(Math.floor(appSettings.Focus.focus.minutes / (appSettings.Focus.focus.breaksAtEvery*60))+1)

export const elapsedAnim = $state({elapsed: 1})

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
  breaksCount: 1, 
}); 

export const tasks = writable<TaskType[]>([]);

export const createFocusWatch = () => {

  let breaks: number
  let curTime: number
  let curTask: TaskType | null = null;
  let timeTask: number;
  let startTime: number | null = null;
  let idInterval: number;
  let curTaskInd: number = -1;
  let skipBreaks: boolean
  let breaksTime: number
  let timeStampStop: number | null = null;
  let lastBreakMinute = -1;
  let breakIdInterval: number;
  let breaksAtMinutes: number
  let idAnimationInterval: number;
  let lastRecordedMinutes: number = 0;

  function startSession() {

    if (startTime === null) {startTime = Date.now()};
    
    idAnimationInterval = setInterval(() => {elapsedAnim.elapsed = Date.now() - startTime!;}, 100);
    if ( timeStampStop !== null) {startTime += Date.now() - timeStampStop; timeStampStop = null}
    idInterval = setInterval(() => {

     if (tasksState.checkedIndex.size > 0 && (curTask === null || !tasksState.checkedIndex.has(curTaskInd) || curTask.order > 1)) { getCurTask(); }
     if (tasksState.checkedIndex.size === 0) {curTask = null;}

      const elapsed = Date.now() - startTime!;
      const timeLeft = curTime - elapsed;
      const totalMinutes = Math.floor(elapsed / 60000);

      const deltaMinutes = totalMinutes - lastRecordedMinutes;
      if (deltaMinutes > 0) {
        appSettings.Focus.focus.curMinutes += deltaMinutes
        appSettings.Focus.goal.completed += deltaMinutes;
        appSettings.Focus.goal.yesterday[1] += Math.floor(deltaMinutes / 60);
        lastRecordedMinutes = totalMinutes;
      };

      if (curTask !== null) {
        curTask.tweenTime.target += (10001/timeTask) * 100
        curTask.timeToSpend = curTask.timeToSpend - tenSecondsAsMinutes;
      
        if (curTask.timeToSpend <= 0) {
          curTask.completed = true;
          curTask.checked = false
          tasksState.countChecked -= 1
          
          tasksState.checkedIndex.delete(curTaskInd) 
          
          const curTasks = get(tasks)
          for (const ind of tasksState.checkedIndex) { curTasks[ind].order -= 1}
          
          notify("/sounds/done-tasks.mp3", "Task", curTask.text);
          getCurTask();
        }
      };

      console.log("breask",breaks)
      console.log("totalMinutes", totalMinutes)
      console.log("breaksAtMinutes", breaksAtMinutes)

      if (!skipBreaks && breaks > 0 && totalMinutes !== 0 && totalMinutes % breaksAtMinutes === 0 && totalMinutes !== lastBreakMinute) {
        stop()
        focusCardState.breaksCount += 1
        notify("/sounds/timer.mp3", "Focus", `Your ${focusCardState.breaksCount} of ${breaksTotal} session`);
        focusCardState.sessionIsOnBreak = true;
        lastBreakMinute = totalMinutes;
        startBreak();
      };

      if (timeLeft <= 0) {
        notify("/sounds/luna.mp3", "Your focus session", "");
        fullStop()
        focusCardState.sessionStarted = false
      };

  }, 10000);};

  function startBreak() {
    
  let breakStart = Date.now();
  
  if ( timeStampStop !== null) {breakStart += Date.now() - timeStampStop; timeStampStop = null}
  idAnimationInterval = setInterval(() => {elapsedAnim.elapsed = Date.now() - breakStart!;}, 100);

  breakIdInterval = setInterval(() => {
    const breakElapsed = Date.now() - breakStart;
    
    if (breakElapsed >= breaksTime) {
      stop()
      notify("/sounds/timer.mp3", "Break", "Your break session");
      breaks -= 1
      startTime! += breakElapsed
      focusCardState.sessionIsOnBreak = false
      console.log("breaks in break", breaks)
      console.log("breakElapsed", breakElapsed)
      console.log("StartTime After Break", startTime)
      startSession();
    }
  }, 1000);
}  

  function updateFocusWatch(initailTime: number, breakTime: number, breaksAt: number, skip: boolean) {
    breaksAtMinutes = Math.floor(breaksAt * 60)
  
    breaks = Math.floor(initailTime / (breaksAt * 60));
    curTime = initailTime * 60 * 1000;
    breaksTime = breakTime * 60 * 1000
    skipBreaks = skip
  }
  
  function getCurTask() {
    const curTasks = get(tasks)
    let curMin: number = Infinity
    curTaskInd = -1
    tasksState.checkedIndex.forEach(ind => {
      const task = curTasks[ind];
      if (task.checked && !task.completed && task.order < curMin) {
        curMin = task.order;
        curTaskInd = ind;
      }
    });

    if (curTaskInd === -1) {
      curTask = null 
      return
    }
    curTask = curTasks[curTaskInd]
    timeTask = curTask.timeToSpend * 60 * 1000
  };
  
  function stop() {
    timeStampStop = Date.now()
    clearInterval(idInterval)
    clearInterval(breakIdInterval)
    clearInterval(idAnimationInterval);
  };

  function fullStop() {
    stop()
    curTask = null
    startTime = null
    timeStampStop = null
    lastBreakMinute = -1
    elapsedAnim.elapsed = 1
    focusCardState.breaksCount = 1
    focusCardState.sessionIsOnBreak = false
    appSettings.Focus.focus.curMinutes = 0 
  }

  function notify(sound: string, name: string, description: string) {
    TimerFinished(name, description)
    const audio = new Audio(sound);
    audio.play().catch((e) => console.error("Audio playback failed:", e));
  }
  
  return {
    stop,
    fullStop,
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

export const focusWatch = createFocusWatch()
 