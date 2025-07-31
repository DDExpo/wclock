<script lang="ts">
  import TopRightButton from "../TopRightButton.svelte";

  import type { TaskType } from "$lib/types/StoreComponentsTypes";
  
  import { createTask, tasksState, deleteTask, tasks } from "$lib/stores/focusState.svelte";
  import { appSettings } from "$lib/stores/utils.svelte";

  let orderTasks = $derived(0)
  
  function toggleChecked(t: TaskType) {
    t.checked = !t.checked
    if (t.checked) {
      orderTasks = (t.order + tasksState.countChecked)
      t.order += 1 + tasksState.countChecked
      tasksState.countChecked += 1
    } else {
      orderTasks = (t.order - tasksState.countChecked)
      t.order -= t.order;
      tasksState.countChecked -= 1
    }
  };


  function validTime(t: TaskType) {

  };
</script>


<div class={["tasks-comp", {light: appSettings.Theme}]}>
  <div class="header">
    <div class="name">Tasks</div>
    <div class="top-buttons">
      <TopRightButton onClick={ createTask } icon="icons/focus/plus.svg" alt="add" --end=16px/>
    </div>
  </div>
  <div class="table">
    <div class="header-row">
      <span class="task-text-start">Check tasks for this session</span>
      <span class="task-text-end">Time to spent</span>
    </div>

    {#each $tasks as t}
      <div class="row">
        {#if t.checked}
          <span></span>
        {/if}
        <input type="checkbox" class="round-checkbox" onchange={() => toggleChecked(t)}/>
        <input type="text" bind:value={t.text} class="task-text">
        <progress value={t.tweenTime.current+tasksState.progress}>
          <input type="number" onchange={() => {validTime(t)}} class="task-time" placeholder={`${Math.floor(t.timeToSpend / 60)}H:${t.timeToSpend % 60}M`}>
        </progress>
        <div class="delete"><TopRightButton onClick={ () => { deleteTask(t.id) }} icon="icons/buttons/trash.svg" alt="delete" --end=14px /></div>
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

.tasks-comp.light .round-checkbox:checked {
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

.delete {
  display: flex;
  width: 20px;
  justify-content: end;
}

.task-text,
.task-time {
  all: unset;
  background-color: rgba(91, 91, 91, 0.601);
  color: #eee;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  cursor: auto;
  text-overflow: ellipsis;
  padding: 6px 10px;
  border-radius: 6px;

  box-shadow: inset 3px 3px 4px rgba(0, 0, 0, 0.6),
              inset -1px -1px 3px rgba(255, 255, 255, 0.08);
}
.task-time {
  width: 50%;
  text-align: center;
}

progress {
  display: block;
  width: 50%;
  background-color: rgba(125, 234, 129, 0.3);
}
.tasks-comp.light progress {
  background-color: rgba(209, 209, 209, 0.3);
}

.tasks-comp.light .task-text,
.tasks-comp.light .task-time {
  background-color: #D9C1A0;
  color: #3B2F2F;
  box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.3),
              inset -2px -2px 3px rgba(255, 255, 255, 0.08);
}

.round-checkbox {
  appearance: none;
  background-color: rgba(255, 255, 255, 0.885);
  min-width: 16px;
  min-height: 16px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

.round-checkbox:checked {
  background-color: rgb(255, 177, 87);
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.7),
              inset -1px -1px 2px rgba(255, 255, 255, 0.1);
}

</style>