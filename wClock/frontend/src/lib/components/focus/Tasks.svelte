<script lang="ts">
  import { tasksState } from "$lib/stores/focusState.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import TopRightButton from "../TopRightButton.svelte";

  function addTask() {
    tasksState.update(t => [...t, {id: crypto.randomUUID(), text: "task", checked: false}])
  }

  function deleteTask(ind: number) {
    tasksState.update(t => t.filter((_, i) => i !== ind));
  }

</script>


<div class={["tasks-comp", {light: appTheme.light}]}>
  <div class="header">
    <div class="name">Tasks</div>
    <div class="top-buttons">
      <TopRightButton onClick={ addTask } icon="icons/focus/plus.svg" alt="add" --end=16px/>
    </div>
  </div>
  <div class="table">
    <div class="header-row">
      <span class="task-text-header">Check tasks for this session</span>
    </div>

    {#each $tasksState as t, ind}
      <div class="row">
        <input type="checkbox" class="round-checkbox" bind:checked={t.checked}/>
        <input type="text" bind:value={t.text} class="task-text" />
        <div class="delete"><TopRightButton onClick={ () => { deleteTask(ind) }} icon="icons/buttons/trash.svg" alt="delete" --end=14px /></div>
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
  background: rgb(33, 33, 33);
}

.tasks-comp.light {
  background: rgb(232, 202, 178);
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
  font-style: italic;
  color: #ffffff;
  margin-bottom: 5px;
  font-size: 20px;
  border-bottom: 2px solid #5b5b5b;
}

.row {
  display: flex;
  color: #eee;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
  font-size: medium;
  margin-left: 7px;
  border-bottom: 1px solid #666666;
  padding-bottom: 4px;
}

.delete {
  display: flex;
  width: 20px;
  justify-content: end;
}

.task-text {
  all: unset;
  font-style: italic;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  cursor: auto;
  text-overflow: ellipsis;
}

.round-checkbox {
  appearance: none;
  background-color: white;
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
}

</style>