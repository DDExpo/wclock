import { writable } from "svelte/store";

import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";
import Goal from "$lib/components/focus/Goal.svelte";

import type { TaskType } from "$lib/types/StoreComponentsTypes";

export const focusComponents = writable(
  [{id: 10, componenet: Focus}, {id: 20, componenet: Tasks}, {id: 30, componenet: Goal}]
);

export const userSettings = $state({
  skip: true,
  time: 30,
}); 

export const gridSeizeState = $state({
  Left: 200,
  Bottom: 250,
});

export const tasksState = writable<TaskType[]>([
  { id: "feqwg", text: "thieggageeragqegjnboqejvbord", checked: false},
  { id: "ageeg", text: "first", checked: false},
  { id: "agegea", text: "second", checked: false},
  { id: "gaegea", text: "snd", checked: false},
  { id: "gaegads", text: "scond", checked: false},
]);
