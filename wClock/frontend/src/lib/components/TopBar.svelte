<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { getAlarms, getCards, watchState } from "$lib/stores/utils.svelte";

  import { CloseWindow, SaveAlarm, SaveCard } from "$lib/wailsjs/go/main/App";
  import { WindowFullscreen, WindowMinimise, WindowUnfullscreen } from "$lib/wailsjs/runtime/runtime";

  let isFullScreen = $state(false)

  function close() {
    SaveCard(getCards())
    SaveAlarm(getAlarms())
    CloseWindow()
  };

  function fullScreen() {
    if (!isFullScreen) {
      isFullScreen = !isFullScreen
      WindowFullscreen()
      return
    }
    isFullScreen = !isFullScreen
    WindowUnfullscreen()
  }

  const minimize = () => WindowMinimise();

</script>

<header class={["topbar", { light: appTheme.light }]} >
  <div class="title">WClock</div>
  <div class="controls">
    <button onclick={ minimize }><img src="icons/topbar/minimize.svg" alt="minimize"/></button>
    {#if !watchState.compact}
      <button onclick={ fullScreen }><img src="icons/topbar/maximize.svg" alt="maximize"/></button>
    {/if}
    <button onclick={ close }><img src="icons/topbar/cross.svg" alt="close"/></button>
  </div>
</header>

<style>
  .topbar {
    display: flex;
    position: absolute;
    width: 100vw;
    z-index: 30;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    background: transparent;
    color: #eee;
    padding-left: 14px;
    padding-top: 6px;
    --wails-draggable: drag;
  }
  
  .topbar.light {
    padding-left: 7px;
  }

  .topbar.light button img {
    filter: opacity(50%);
  }

  .topbar.light .title{
    color: #3B2F2F;
    font-family: serif;
  }
  
  .topbar.light .controls {
    padding-right: 9px;
  }

  .title {
    font-family: dark-theme-font;
    font-size: 0.8rem;
    font-weight: bold;
    user-select: none;
  }

  .controls {
    display: flex;
    padding-right: 16px;
    user-select: none;
  }

  button {
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;

  }
  
  button img {
    width: 12px;
    transition: transform 0.2s ease;
    filter:  invert(90%) opacity(80%);
  }

  button img:hover {
    transform: scale(1.5);
  }
</style>