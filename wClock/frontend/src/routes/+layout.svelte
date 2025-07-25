<script lang="ts">
  import '../app.css';
  
  import { onMount } from "svelte";
  
  import type { dialTime, weekDaysBool } from "$lib/types/StoreComponentsTypes";
  
  import SideBar from "$lib/components/SideBar.svelte";
  import TopBar from "$lib/components/TopBar.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { debounce, getAlarms, getCards, watchState } from "$lib/stores/utils.svelte";
  import { GetWindowsPcColors, GetSettings, GetCards, GetAlarms, SaveCard, SaveAlarm } from "$lib/wailsjs/go/main/App";
  import { cards } from "$lib/stores/timerWatch.svelte";
  import { alarms } from "$lib/stores/alarms.svelte";
  import { Card } from "$lib/stores/class/ClassCard.svelte";
  import { Alarm } from "$lib/stores/class/ClassAlarms.svelte";

	let { children } = $props();    
  const debounceCards = debounce(() => SaveCard(getCards()))
  const debounceAlarms = debounce(() => SaveAlarm(getAlarms()))  

  onMount(async() => {
    const savedT = await GetSettings()
    appTheme.light = savedT
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor)
    
    const cardsGo = await GetCards();
    cards.set(cardsGo.map(card =>
    new Card(card.ID, card.Name, card.InitialDial as dialTime, card.Dial as dialTime, card.TimeLeft)));
    
    const alarmsGo = await GetAlarms();
    alarms.set(alarmsGo.map(alarm =>
    new Alarm(alarm.ID, alarm.Text, alarm.Dial as [number, number, number, number], alarm.Enable, alarm.WeekDays as weekDaysBool)));
  });

  cards.subscribe(() => {
    debounceCards()
  });

  alarms.subscribe(() => {
    debounceAlarms()
  });
</script>

<div class="right-space"></div>
<div class="bottom-space"></div>
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