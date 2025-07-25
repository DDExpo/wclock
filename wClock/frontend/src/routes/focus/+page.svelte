<script lang="ts">
  import { onMount } from "svelte";

  import { dndzone } from "svelte-dnd-action";
  
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { focusComponents } from "$lib/stores/focusState.svelte";

  let isResizing = $state(false);
  let startX = $state(0);
  let startWidthLeft = $state(0);
  let gridEl: HTMLDivElement;
  let drag: boolean = $state(false)


  function handleDndConsider(e: CustomEvent) {
      focusComponents.comps = e.detail.items;
  }
  function handleDndFinalize(e: CustomEvent) {
      focusComponents.comps = e.detail.items;
    }

  function onMouseDown(e: MouseEvent) {
    isResizing = true;
    drag = true;
  
    startX = e.clientX;
    console.log(e)
    console.log(e.clientX)
    const cols = getComputedStyle(gridEl).gridTemplateColumns.split(" ");
    startWidthLeft = parseInt(cols[0]);
  }

  function onMouseMove(e: MouseEvent) {
    if (!isResizing) return;
    const delta = e.clientX - startX;
    const containerWidth = gridEl.offsetWidth;
    const gap = parseInt(getComputedStyle(gridEl).gap);
    const total = containerWidth - 5 - gap;

    let newLeft = startWidthLeft + delta;

    const minLeft = 190;
    const maxLeft = total - minLeft;

    newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));

    const rightWidth = total - newLeft;

    gridEl.style.gridTemplateColumns = `${newLeft}px 5px ${rightWidth}px`;
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
  }

  onMount(() => {
    gridEl = document.querySelector(".grid-container")!;
    console.log(gridEl)
  });

</script>


<div class="pa">
  <div class={["focus-page", {"light": appTheme.light}]}>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div class="grid-container" use:dndzone={{items: focusComponents.comps, dragDisabled:drag, dropTargetStyle:{"outline": 'none' }}} 
           onconsider={ handleDndConsider } onfinalize={ handleDndFinalize }>
          {#each focusComponents.comps as c, i (c.id)}
            <div class={["grid-item", { "grid-a": i === 0, "grid-b": i === 1, "grid-c":i === 2}]}>
              <c.componenet />
            </div>
          {/each}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div class="splitter" onmouseover={ onMouseOver } onmouseout={ onMouseOut } onmousedown={ onMouseDown } onmousemove={ onMouseMove } onmouseup={ onMouseUp } role="separator" onfocus={onMouseOver} onblur={onMouseOut}></div>
        <div class="splitter-horiz" onmouseover={ onMouseOver }  onmouseout={ onMouseOut } onmousedown={ onMouseDown } onmousemove={ onMouseMove } onmouseup={ onMouseUp } role="separator" onfocus={onMouseOver} onblur={onMouseOut}></div>
    </div>
  </div>
</div>

<style>

.pa {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: fit-content;
  max-width: fit-content;
}

.focus-page {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  scrollbar-width: 12px;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

.focus-page.light .grid-container {
  border-radius: 15px;
  background-color: rgba(209, 209, 209, 0.463);
}

.focus-page.light .splitter,
.focus-page.light .splitter-horiz {
  background: #fff4e9;
}

.grid-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  background-color: rgba(118, 118, 118, 0.383);
  grid-template-columns: 1fr 5px 1fr;
  grid-template-rows: auto auto;
  gap: 5px;
  margin-left: 80px;
  margin-top: 40px;
  margin-bottom: 40px;
  margin-right: 15px;
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