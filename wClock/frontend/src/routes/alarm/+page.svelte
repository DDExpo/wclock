<script lang="ts">
  import AddForm from "$lib/components/AddForm.svelte";
  import Alarm from "$lib/components/alarm/alarm.svelte";
  import { alarms } from "$lib/stores/alarms.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  
  let showAddForm: boolean = $state(false);

  function hideShowForm() {
    showAddForm = !showAddForm
  }

</script>

<div class={["alarm-page", { light: appTheme.light }]}>
  <div class="alarm-grid">
    {#each $alarms as alr, ind}
      <Alarm alarm={alr} alarmInd={ind}/>
    {/each}
    {#if showAddForm}
      <AddForm closeForm={ hideShowForm } formName="Add Alarm" digitsLen={4} alarm={true} />
    {/if}
    <button class="add-btn" onclick={ hideShowForm }><img src="icons/buttons/add.svg" alt="add"/></button>
  </div>
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
  gap: 1.5vh 1.5vw;
  padding-left: clamp(75px, 22vw, 140px);
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
