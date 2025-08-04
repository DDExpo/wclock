<script lang="ts">
  import TopRightButton from "../TopRightButton.svelte";
  
  import type { TaskType } from "$lib/types/StoreComponentsTypes";
  
  import { appSettings } from "$lib/stores/utils.svelte";
  import { createTask, tasksState, deleteTask, tasks, focusCardState} from "$lib/stores/focusState.svelte";
  
  let isNotValid: boolean = $state(false)

  function validTime(t: TaskType) {
    let num = Number(t.timeInitToSpend)
    if (isNaN(num) || num <= 0 || num > 1440) {
      t.timeInitToSpend = 15
      t.timeToSpend = 15
      isNotValid = true
      t.checked = false
      return false
    };
    t.timeInitToSpend = num
    t.timeToSpend = num
    isNotValid = false
    return true
  }

  function toggleChecked(t: TaskType, ind: number) {
    t.checked = !t.checked
    if (!validTime(t)) return
    if (!t.checked) {
      tasksState.checkedIndex.delete(ind) 
      for (const ind of tasksState.checkedIndex) {
        if (t.order < $tasks[ind].order) 
        { $tasks[ind].order -= 1}}
      tasksState.countChecked -= 1
      return
    };
    tasksState.countChecked += 1
    t.order = tasksState.countChecked
    tasksState.checkedIndex.add(ind)
  };

  function deleteTaskById(id: string, ind: number) {
    tasksState.checkedIndex = new Set([...tasksState.checkedIndex] .map(i => i > ind ? i - 1 : i));
    deleteTask(id)
  };

</script>

<div class={["tasks-comp", {light: appSettings.Theme}]}>
  <div class="header">
    <div class="name">Tasks</div>
    <div class="top-buttons">
      <TopRightButton onClick={ createTask } icon="icons/focus/plus.svg" alt="add" --end=20px/>
    </div>
  </div>
  <div class="table">
    <div class="header-row">
      <span class="task-text-start">Check tasks for this session</span>
      <span class="task-text-end">Time to spent</span>
    </div>

    {#each $tasks as t, ind}
      <div class={["row", {completed: t.completed}]}>
        {#if t.checked}
          <span>{t.order}</span>
        {/if}
        <input type="checkbox" class={["round-checkbox", {checked: t.checked}]} onchange={() => toggleChecked(t, ind)}/>
        <input type="text" bind:value={t.text} class="task-text" readonly={t.checked}>
        <div class={["input-with-progress", {valid: isNotValid}]}>
          <progress max=100 value={t.tweenTime.current}></progress>
          {#if focusCardState.sessionStarted}
            <input type="number" readonly value={`${Math.floor(t.timeToSpend / 60)}:${(t.timeToSpend % 60).toString().padStart(2, '0')}`}>
          {:else}
            <input type="number" min=0 max=1440 readonly={t.checked} bind:value={t.timeInitToSpend} placeholder="minutes">
          {/if}
        </div>
        {#if !t.checked}
          <div class="delete"><TopRightButton onClick={ () => { deleteTaskById(t.id, ind) }} icon="icons/buttons/trash.svg" alt="delete" --end=17px /></div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>

.tasks-comp {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  container-type: inline-size;
  background: rgb(33, 33, 33);
}

.tasks-comp.light {
  background: #E8CAB2;
}
.tasks-comp.light .header-row,
.tasks-comp.light .row {
  color: #3B2F2F;
}

.tasks-comp.light .round-checkbox.checked {
  background-color: rgb(211, 240, 156);
}

.header {
  display: flex;
  width: 100;
  height: fit-content;
  padding: 0.7rem;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-weight: bold;
  font-size: 1.1rem;
}

.top-buttons {
  display: flex;
  gap: 8px;
  justify-content: end;
}

.table {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  gap: 10px;
  overflow: auto;
  scrollbar-width: none;
}

.header-row {
  display: flex;
  position: relative;
  font-style: italic;
  color: #ffffff;
  width: 100%;
  gap: 10cqw;
  margin-bottom: 10px;
  font-size: 20px;
  border-bottom: 2px solid #5b5b5b;
  justify-content: space-between;
}

.header-row .task-text-end {
  margin-right: 12%;
}

.row {
  display: flex;
  color: #eee;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
  font-size: larger;
  margin-left: 7px;
  border-bottom: 1px solid #666666;
  padding-bottom: 4px;
}

.row.completed {
  background-color: rgba(127, 255, 212, 0.657);
}

.delete {
  width: 26px;
  display: flex;
  justify-content: end;
}

.task-text {
  all: unset;
  color: #eee;
  width: 100%;
  cursor: auto;
  padding: 6px 10px;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 6px;
  text-overflow: ellipsis;
  box-shadow: inset 3px 3px 4px rgba(0, 0, 0, 0.6),
              inset -1px -1px 3px rgba(255, 255, 255, 0.08);
  background-color: rgba(91, 91, 91, 0.601);
}

.input-with-progress {
  display: inline-block;
  width: 50%;
  height: 100%;
  position: relative;
}

.input-with-progress.valid input {
  background-color: rgb(232, 73, 73);
}

.tasks-comp.light .input-with-progress.valid input {
  background-color: rgb(232, 73, 73);
}

.input-with-progress input {
  all: unset;
  color: #eee;
  width: 100%;
  height: 100%;
  cursor: auto;
  z-index: 2;
  position: relative;
  overflow: hidden;
  text-align: center;
  align-items: center;
  white-space: nowrap;
  border-radius: 6px;
  text-overflow: ellipsis;
  box-shadow: inset 3px 3px 4px rgba(0, 0, 0, 0.6),
              inset -1px -1px 3px rgba(255, 255, 255, 0.08);
  background-color: rgba(91, 91, 91, 0.601);
}

input[type="number"] {
  -webkit-appearance: none;
  -moz-appearance: textfield;
  appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}

.input-with-progress input::placeholder {
  color: rgba(255, 255, 255, 0.694);
}
.tasks-comp.light .input-with-progress input::placeholder {
  color: #3b2f2f89;
}

.input-with-progress progress {
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  appearance: none;
  pointer-events: none;
  background-color: transparent;
  -webkit-appearance: none;
}

progress::-webkit-progress-bar {
  background-color: transparent;
}

progress::-webkit-progress-value {
  border-radius: 7px;
  background-color: rgb(0, 166, 255); /* light blue overlay */
}

.tasks-comp.light .task-text,
.tasks-comp.light .input-with-progress input{
  color: #3B2F2F;
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.3),
              inset -2px -2px 3px rgba(255, 255, 255, 0.08);
  background-color: #d9c1a07c;
}

.round-checkbox {
  cursor: pointer;
  display: inline-block;
  position: relative;
  min-width: 19px;
  min-height: 19px;
  appearance: none;
  border-radius: 50%;
  vertical-align: middle;
  background-color: rgba(255, 255, 255, 0.885);
}

.round-checkbox.checked {
  background-color: rgb(255, 177, 87);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.7),
              inset -1px -1px 2px rgba(255, 255, 255, 0.1);
}

</style>