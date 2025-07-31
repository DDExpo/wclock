import { writable } from "svelte/store";

import Goal from "$lib/components/focus/Goal.svelte";
import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";

import type { TaskType } from "$lib/types/StoreComponentsTypes";

import { Task } from "./class/ClassTask.svelte";
import { DbDelete } from "$lib/wailsjs/go/main/App";
import { debounceDelete, isDeleteHappening } from "./utils.svelte";

export const tasksState = $state({
  progress: 0,
  countChecked: 0
});

export const focusComponents = writable(
  [{id: 10, componenet: Focus}, {id: 20, componenet: Tasks}, {id: 30, componenet: Goal}]
);

export const goalCardState = $state({
  dailyGoal: 8,
  clearHour: 12,
  clearMinute: 0,
  isFlipped: false,
  includeWeekends: false,
});

export const focusCardState = $state({
  sessionSide: false,
  isSettingsSide: false,
}); 

export const gridSeizeState = $state({
  Left: 200,
  Bottom: 250,
});

export const tasks = writable<TaskType[]>([]);

const deleteDebounceTasks = debounceDelete(DbDelete, "tasks");

export function createTask() {
  tasks.update(t => [...t, new Task(crypto.randomUUID(), "task", false, 0, 0, 0)])
}

export function deleteTask(id: string) {
  isDeleteHappening.yes = true
  deleteDebounceTasks(id)
  tasks.update(
    t => {return t.filter(task => task.id!== id);
  });
  setTimeout(() => isDeleteHappening.yes=false, 250)

}