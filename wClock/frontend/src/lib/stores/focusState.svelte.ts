import Focus from "$lib/components/focus/Focus.svelte";
import Tasks from "$lib/components/focus/Tasks.svelte";
import Goal from "$lib/components/focus/Goal.svelte";

export const focusComponents = $state({
  comps:[{id: 10, componenet: Focus}, {id: 20, componenet: Tasks}, {id: 30, componenet: Goal}]
});