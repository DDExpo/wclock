import { writable } from "svelte/store";

import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";
import Goal from "$lib/components/focus/Goal.svelte";

import type { TaskType } from "$lib/types/StoreComponentsTypes";
import { DbDelete } from "$lib/wailsjs/go/main/App";
import { debounceDelete } from "./utils.svelte";
import { Task } from "./class/ClassTask.svelte";

export const focusComponents = writable(
  [{id: 10, componenet: Focus}, {id: 20, componenet: Tasks}, {id: 30, componenet: Goal}]
);

export const goalCardState = $state({
  isFlipped: false,
  dailyGoal: 8,
  clearHour: 12,
  clearMinute: 0,
  includeWeekends: false,
});

export const focusCardState = $state({
  isSettingsSide: false,
  sessionSide: false,
}); 

export const gridSeizeState = $state({
  Left: 200,
  Bottom: 250,
});

export const tasks = writable<TaskType[]>([]);

 
const deleteDebounceTasks = debounceDelete(DbDelete, "tasks");

export function createTask() {
  tasks.update(t => [...t, new Task(crypto.randomUUID(),"task", false, '')])
}

export function upadeteTask() {
  tasks.update(t => [...t, new Task(crypto.randomUUID(),"task", false, '')])
}

export function deleteTask(id: string) {
  tasks.update(
    t => {return t.filter(task => task.id!== id);
  });

  deleteDebounceTasks(id)
}