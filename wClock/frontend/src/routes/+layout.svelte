<script lang="ts">
  import '../app.css';
  
  import SideBar from "$lib/components/SideBar.svelte";
  
  import { onMount } from "svelte";
  import { GetWindowsPcColors } from "$lib/wailsjs/go/main/App";

  import { isLightTheme } from "$lib/stores/themes";
  import { userWindowsPcColor } from "$lib/stores/themes";

	let { children } = $props();

  onMount(async() => {
    const color = await GetWindowsPcColors()
    if (color) {userWindowsPcColor.set(color)};
    document.documentElement.style.setProperty('--user-pc-color', $userWindowsPcColor);
  })

</script>

<main>
  <div class="main-layout">
    <SideBar />
    <div class="background-gradient-left-60px" class:light={$isLightTheme}></div>
  </div>
</main>
{@render children()}

<style>

.main-layout  {
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
  top: 0px;
  left: 0px;
}

.background-gradient-left-60px {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 60px;
  z-index: -1;
  background-image: url('images/background/subtle-prism.svg');
}

.background-gradient-left-60px.light {
  background-image: url('images/background/subtle-prism-light.svg');
}

</style>