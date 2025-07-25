<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";

  let { onClick, icon, alt, isRunning=false } = $props()

</script>

<button class={["circle-button", { "running": isRunning, "light": appTheme.light }]} onclick={ onClick }>
  <img src="{icon}" alt="{alt}"/>
</button>

<style> 

  .circle-button {
    width: clamp(30px, 6vw, 60px);
    height: clamp(30px, 6vw, 60px);
    border-radius: 50%;
    border: transparent;
    background-color: #2f2f2f;
    display: flex;
    margin-top: 1vh;
    margin-bottom: 3vw;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    box-shadow: -4px 6px 8px rgba(23, 23, 23, 0.5);
    user-select: none;
  }
  .circle-button:hover {
    background: #6b6b6b;
    border: 2px inset var(--user-pc-color, rgb(255, 180, 94));
  }
  .circle-button.running {
    background-color: #6b6b6b;
  }
  .circle-button img {
    width: 55%;
    height: 55%;
    filter: invert(90%) opacity(90%);
    object-fit: contain;
    cursor: pointer;
  }

  .circle-button.light {
    background-color: #e8eeffc6;
    box-shadow: -4px 6px 8px rgba(23, 23, 23, 0.2);
  }
  .circle-button.light img {
    filter: invert(10%) opacity(80%);
  }
  .circle-button.light.running {
    background-color: #b0f8b6;
  }
  .circle-button.light:hover,
  .circle-button.light.running:hover {
    background-color: #FFF0A4;
  }

</style>