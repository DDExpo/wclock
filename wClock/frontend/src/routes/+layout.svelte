<script lang="ts">
  import '../app.css';
  import SideBar from "$lib/components/SideBar.svelte";
    
  import { onMount } from "svelte";
  
  import { GetWindowsPcColors } from "$lib/wailsjs/go/main/App";

  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { watchState } from '$lib/stores/stopWatch.svelte';

	let { children } = $props();

  onMount(async() => {
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);
  })

</script>

<main>
  <div class="main-layout">
    {#if !watchState.isCompact}
      <SideBar />
    {/if}
    <div class="background-img" class:light={appTheme.isLight}></div>
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
  background-image: url('images/background/background.svg');
  background-size: cover;
  background-position: center;
}

.background-img.light {
  background-image: url('images/background/background-light.svg');
  opacity: 0.5;
}

</style>