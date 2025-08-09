<script lang="ts">
  import '../app.css';
  
  import { fade } from 'svelte/transition';
  import { onMount, tick } from "svelte";
  
  import TopBar from "$lib/components/TopBar.svelte";
  import SideBar from "$lib/components/SideBar.svelte";

  import { GetWindowsPcColors, GetSettings, DBSave } from "$lib/wailsjs/go/main/App";
  import { gofunc } from '$lib/wailsjs/go/models';
  import { alarms } from "$lib/stores/alarms.svelte";
  import { cards } from "$lib/stores/timerWatch.svelte";
  import { tasks } from '$lib/stores/focusState.svelte';
  import { loadStartupData } from '$lib/stores/startup.svelte';
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { appSettings, debounce, getAlarms, getCards, getTasks, watchState } from "$lib/stores/utils.svelte";

	let { children } = $props();
  let ready = $state(false)


  onMount(async() => {

    const color = await GetWindowsPcColors()
    GetSettings().then((data) => {Object.assign(appSettings, data);});
    
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor)
    
    ready = true
  
    const today = new Date();
    const isPastClearDate = (Date.now() >= new Date().setHours(appSettings.Focus.goal.clearHours, appSettings.Focus.goal.clearMinutes, 0, 0) &&
    appSettings.Focus.goal.monthDay[0] !== today.getMonth() || appSettings.Focus.goal.monthDay[1] !== today.getDate());

    if (isPastClearDate) {
      if ((appSettings.Focus.goal.dailyGoal <= Math.floor(appSettings.Focus.goal.completed / 60)) && (!appSettings.Focus.goal.includeWeekdays && today.getDay() < 5 ) || (appSettings.Focus.goal.includeWeekdays && today.getDay() > 4)) {
        appSettings.Focus.goal.streak += 1
      } else {appSettings.Focus.goal.streak = 0}
      appSettings.Focus.goal.yesterday[0] = appSettings.Focus.goal.yesterday[1]
      appSettings.Focus.goal.yesterday[1] = 0
      appSettings.Focus.goal.completed = 0
    }
    
    const debounceCards = debounce(() => DBSave("cards", gofunc.ItemsDB.createFrom({ "Cards": getCards() })))
    const debounceTasks = debounce(() => DBSave("tasks", gofunc.ItemsDB.createFrom({ "Tasks": getTasks() })))
    const debounceAlarms = debounce(() => DBSave("alarms", gofunc.ItemsDB.createFrom({ "Alarms": getAlarms() })))
    cards.subscribe(() => debounceCards());
    tasks.subscribe(() => debounceTasks());
    alarms.subscribe(() => debounceAlarms());
    setInterval(debounceCards, 60000)

    requestAnimationFrame(() => {
      loadStartupData(isPastClearDate);
    });
  });
  
</script>

<div class="right-space"></div>
<div class="bottom-space"></div>
<main>
  {#if ready}
  <div class="main-layout" in:fade={{ duration: 500 }}>
    <TopBar />
    {#if !(watchState.compact)}
    <SideBar />
    {/if}
    <div class={["background-img", { light: appSettings.Theme }]}></div>
  </div>
  {/if}
</main>

{@render children()}

<style>
.main-layout  {
  display: flex;
  overflow: hidden;
  height: 100%;
  width: 100%;
}

.right-space {
  display: flex;
  position: absolute;
  background-color: transparent;
  border: transparent;
  right: 0px;
  z-index: 100;
  height: 100vh;
  width: 8px;
}

.bottom-space {
  display: flex;
  position: absolute;
  background-color: transparent;
  border: transparent;
  bottom: 0px;
  z-index: 100;
  height: 8px;
  width: 100vw;
}

.background-img {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: -1;
  background-image: url('/images/backgroundImg/background.svg');
  background-size: cover;
  opacity: 0.99;
  background-position: center;
}

.background-img.light {
  background-image: url('/images/backgroundImg/background-light.svg');
  opacity: 0.8;
}

</style>