<script lang="ts">
  import {dndzone} from "svelte-dnd-action";

  import AddForm from "$lib/components/AddForm.svelte";
  import Alarm from "$lib/components/alarm/Alarm.svelte";

  import { alarms } from "$lib/stores/alarms.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { notDraggable } from "$lib/stores/timerWatch.svelte";
  
  let showAddForm: boolean = $state(false);

  function hideShowForm() {
    showAddForm = !showAddForm;
  };
  function handleDndConsider(e: CustomEvent) {
    alarms.set(e.detail.items);
  };
  function handleDndFinalize(e: CustomEvent) {
    alarms.set(e.detail.items);
  }

</script>

<div class={["alarm-page", { light: appTheme.light }]}>
  <div class="alarm-grid" use:dndzone={{ items: $alarms, dropTargetStyle:{"outline": 'none'}, dragDisabled:notDraggable.dragg}} onconsider={handleDndConsider} onfinalize={handleDndFinalize}>
    {#each $alarms as alr, index (alr.id)}
      <Alarm alarm={alr} alarmInd={index} timeTo={alr.timeToAlarm} />
    {/each}
  </div>
  {#if showAddForm}
    <AddForm closeForm={ hideShowForm } formName="Add Alarm" digitsLen={4} alarm={true} />
  {/if}
  <button class="add-btn" onclick={ hideShowForm }><img src="icons/buttons/add.svg" alt="add"/></button>
</div>

<style>


.alarm-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.alarm-page.light .add-btn img {
  filter: invert(10%) opacity(80%);
}

.alarm-grid {
  display: flex;
  height: fit-content;
  width: fit-content;
  flex-wrap: wrap;
  gap: 2vh 1.5vw;
  padding-left: clamp(75px, 20vw, 140px);
  padding-top: 40px;
  padding-bottom: 40px;
  padding-right: 25px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
}

.add-btn {
  position: absolute;
  background: none;
  border: none;
  bottom: 12px;
  right: 3px;
}
.add-btn img {
  width: 20px;
  filter:  invert(90%) opacity(90%);
  cursor: pointer;
}
.add-btn img:hover,
.alarm-page.light .add-btn img:hover {
  transition: transform 0.3s ease;
  transform: scale(1.5);
}


</style>
