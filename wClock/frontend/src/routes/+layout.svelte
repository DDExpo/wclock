<script lang="ts">
  import { onMount } from "svelte";
  
  import '../app.css';
  
  import SideBar from "$lib/components/SideBar.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { watchState } from "$lib/stores/stopWatch.svelte";
  import { GetWindowsPcColors } from "$lib/wailsjs/go/main/App";

	let { children } = $props();

  onMount(async() => {
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);
  })

</script>

<main>
  <div class="main-layout">
    <TopBar />
    {#if !(watchState.compact)}
    <SideBar />
    {/if}
    <div class={["background-img", { light: appTheme.light }]}></div>
  </div>
</main>
{@render children()}

<style>
.main-layout  {
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.background-img {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  background-image: url('images/backgroundImg/background.svg');
  background-size: cover;
  opacity: 0.99;
  background-position: center;
}

.background-img.light {
  background-image: url('images/backgroundImg/background-light.svg');
  opacity: 0.8;
}

</style>