<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { dndzone } from "svelte-dnd-action";
  
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { focusComponents, gridSeizeState } from "$lib/stores/focusState.svelte";
  
  let gridEl: HTMLDivElement;

  let isResizing: boolean = $state(false);
  let drag: boolean = $state(false);
  let newLeft: number = $state(0);
  let newBottom: number = $state(0);

  function handleDndConsider(e: CustomEvent) {
      focusComponents.set(e.detail.items)
  }
  function handleDndFinalize(e: CustomEvent) {
      focusComponents.set(e.detail.items)
    }

  function onMouseDown(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement;
    el.focus(); 
    el.requestPointerLock();
    isResizing = true;
    drag = true;
  };

  function onMouseMove(e: MouseEvent) {
    if (!isResizing) return;

    newLeft += e.movementX;

    const minLeft = 190;
    const maxLeft = gridEl.offsetWidth - 10 - minLeft;

    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));

    gridEl.style.gridTemplateColumns = `${newLeft}px 5px`;
  };


  function onMouseMoveHoriz(e: MouseEvent) {
    if (!isResizing) return;

    newBottom += e.movementY;

    const minTop = 250;
    const maxTop = gridEl.offsetHeight - 10 - minTop;

    newBottom = Math.max(minTop, Math.min(newBottom, maxTop));

    gridEl.style.gridTemplateRows = `${newBottom}px 1fr`;
  }

  function onMouseOver() {
    drag = true;
  }

  function onMouseOut() {
    drag = false
    isResizing = false

  }

  function onMouseUp() {
    isResizing = false;
    drag = false
    setTimeout(() => {document.exitPointerLock(), 1000})
  }

  onDestroy(() => {
    gridSeizeState.Left = newLeft < 190 ? 190: newLeft
    gridSeizeState.Bottom = newBottom < 250 ? 250: newBottom
  })

  onMount(() => {
    gridEl = document.querySelector(".grid-container")!;
    gridEl.style.gridTemplateColumns = `${gridSeizeState.Left}px 5px`;
    gridEl.style.gridTemplateRows = `${gridSeizeState.Bottom}px 1fr`;
    newLeft = gridSeizeState.Left
    newBottom = gridSeizeState.Bottom
  });

</script>


<div class="pa">
  <div class={["focus-page", {"light": appTheme.light}]}>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="grid-container" use:dndzone={{items: $focusComponents, dragDisabled:drag, dropTargetStyle:{"outline": 'none' }}} 
                                onconsider={ handleDndConsider } onfinalize={ handleDndFinalize }>
        {#each $focusComponents as c, i (c.id)}
          <div class={["grid-item", { "grid-a": i === 0, "grid-b": i === 1, "grid-c":i === 2}]}>
            <c.componenet />
          </div>
        {/each}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="splitter" onmouseover={ onMouseOver } onmouseout={ onMouseOut } onmousedown={ onMouseDown } onmousemove={ onMouseMove } onmouseup={ onMouseUp } role="separator" onfocus={onMouseOver} onblur={onMouseOut} tabindex="0"></div>
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="splitter-horiz" onmouseover={ onMouseOver }  onmouseout={ onMouseOut } onmousedown={ onMouseDown } onmousemove={ onMouseMoveHoriz } onmouseup={ onMouseUp } role="separator" onfocus={onMouseOver} onblur={onMouseOut} tabindex="0"></div>
    </div>
  </div>
</div>

<style>

.pa {
  display: flex;
  width: 100%;
  height: 100%;
}

.focus-page {
  width: 100%;
  overflow: auto;
  scrollbar-width: thick;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

.focus-page.light .grid-container {
  background-color: rgba(209, 209, 209, 0.5);
  box-shadow: 0px 0px 30px rgba(97, 97, 97, 0.4);
  border-radius: 20px;
  color: #3b2f2faf;
  font-family: serif;
}

.focus-page.light .splitter,
.focus-page.light .splitter-horiz {
  background: #fff4e9;
}

.grid-container {
  display: grid;
  width: 90%;
  min-width: fit-content;
  height: 90%;
  color: #eeeeeed3;
  font-weight: bold;
  font-family: dark-theme-font;
  min-height: fit-content;
  box-shadow: 0px 0px 30px rgba(156, 156, 156, 0.1);
  background-color: rgba(84, 84, 84, 0.383);
  grid-template-columns: 1fr 5px 1fr;
  grid-template-rows: auto auto;
  margin-top: 40px;
  padding: 0.6rem;
  gap: 5px;
  margin-left: clamp(80px, 10vw, 150px);
  margin-right: clamp(15px, 10vw, 60px);
}

.grid-item {
  min-width: 200px;
  min-height: 250px;
}

.grid-a {
  grid-column: 1 / span 2;
  grid-row: 1;
}

.grid-b {
  grid-column: 3 / 4;
  grid-row: 1 / span 2;
}

.grid-c {
  grid-column: 1 / span 2;
  grid-row: 2;
}

.splitter {
  position: relative;
  grid-column: 2 / 3;
  grid-row: 1 / 3;
  background: rgb(255, 180, 94);
  cursor: col-resize;
  width: 5px;
  height: 100%;
  margin-left: 5px;
}

.splitter-horiz {
  position: relative;
  grid-column: 1 / 3;
  grid-row: 2;
  background: rgb(255, 180, 94);
  cursor: row-resize;
  height: 5px;
  width: 100%;
  margin-top: -5px;
}

</style>