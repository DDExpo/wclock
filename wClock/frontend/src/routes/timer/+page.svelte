<script lang="ts">
  import {dndzone} from "svelte-dnd-action";

  import AddForm from "$lib/components/AddForm.svelte";
  import Card from "$lib/components/timer/Card.svelte";

  import { cards, notDraggable } from "$lib/stores/timerWatch.svelte";
  import { appSettings, watchState } from "$lib/stores/utils.svelte";

  let showAddForm: boolean = $state(false);

  function hideShowForm() {
    showAddForm = !showAddForm
  }
  function handleDndConsider(e: CustomEvent) {
    cards.set(e.detail.items);
  };
  function handleDndFinalize(e: CustomEvent) {
    cards.set(e.detail.items);
  };

</script>

<div class={["timer-page", { light: appSettings.Theme, "compact": watchState.compact}]}>
    <div class="card-grid" use:dndzone={{ items: $cards, dropTargetStyle:{"outline": 'none'}, dragDisabled:watchState.compact||notDraggable.dragg}}  onconsider={handleDndConsider} onfinalize={handleDndFinalize}>
      {#each $cards as card, index (card.id)}
      <Card card={card} cardInd={index}/>
      {/each}
    </div>
    {#if showAddForm}
    <AddForm closeForm={ hideShowForm } formName="Add Timer" />
    {/if}
    {#if !watchState.compact}
    <button class="add-btn" onclick={ hideShowForm }><img src="icons/buttons/add.svg" alt="add"/></button>
    {/if}
</div>

<style>

.timer-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.timer-page.compact {
  overflow: hidden;
}

.timer-page.light .add-btn img {
  filter: invert(10%) opacity(80%);
}

.card-grid {
  display: flex;
  height: fit-content;
  width: fit-content;
  flex-wrap: wrap;
  gap: 2vh 1.5vw;
  padding-left: clamp(100px, 25vw, 140px);
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
.timer-page.light .add-btn img:hover {
  transition: transform 0.3s ease;
  transform: scale(1.5);
}

</style>
