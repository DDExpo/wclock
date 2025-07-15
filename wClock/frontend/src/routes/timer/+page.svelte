<script lang="ts">
  import AddForm from "$lib/components/timer/AddForm.svelte";

  import Card from "$lib/components/timer/Card.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { cards } from "$lib/stores/timerWatch.svelte";

  let showAddForm: boolean = $state(false);
  let draggedIndex = $state(-1);

  function hideShowForm() {
    showAddForm = !showAddForm
  }

  function handleDragStart(event: DragEvent, index: number) {
    draggedIndex = index;
  }

  function handleDrop(event: DragEvent, targetIndex: number) {
    if (draggedIndex === -1 || draggedIndex === targetIndex) return;
    
    cards.update(c => {
      const reordered = [...c];
      const [moved] = reordered.splice(draggedIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      return reordered;
    });

    draggedIndex = -1;

  }

</script>

<div class={["timer-page", { light: appTheme.light }]}>
  <div class="card-grid">
    {#each $cards as card, index}
      <div class="draggable" draggable="true" ondragstart={(e) => handleDragStart(e, index)}
           ondragover={(e) => e.preventDefault()} ondrop={(e) => handleDrop(e, index)} role="listitem"
           aria-grabbed={draggedIndex === index} aria-dropeffect="move">
        <Card card={card} ind={index}/>
      </div>
    {/each}
  </div>
  {#if showAddForm}
    <AddForm closeForm={ hideShowForm } formName="Add" />
  {/if}
  <button class="add-btn" onclick={ hideShowForm }><img src="icons/buttons/add.svg" alt="add"/></button>
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

.timer-page.light .add-btn img {
  filter: invert(10%) opacity(80%);
}

.card-grid {
  display: flex;
  height: fit-content;
  width: fit-content;
  flex-wrap: wrap;
  gap: 1.5vh 1.5vw;
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
