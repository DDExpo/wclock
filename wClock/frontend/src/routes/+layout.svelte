<script lang="ts">
  import '../app.css';
  
  import { onMount } from "svelte";
  
  import type { dialTime, weekDaysBool } from "$lib/types/StoreComponentsTypes";
  
  import SideBar from "$lib/components/SideBar.svelte";
  import TopBar from "$lib/components/TopBar.svelte";

  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { appSettings, debounce, getAlarms, getCards, getTasks, watchState } from "$lib/stores/utils.svelte";
  import { GetWindowsPcColors, GetSettings, GetCards, GetAlarms, SaveCard, SaveAlarm, SaveTasks, GetTasks } from "$lib/wailsjs/go/main/App";
  import { alarms } from "$lib/stores/alarms.svelte";
  import { cards } from "$lib/stores/timerWatch.svelte";
  import { tasks, tasksState } from '$lib/stores/focusState.svelte';
  import { Card } from "$lib/stores/class/ClassCard.svelte";
  import { Task } from "$lib/stores/class/ClassTask.svelte";
  import { Alarm } from "$lib/stores/class/ClassAlarms.svelte";

	let { children } = $props();    
  
  onMount(async() => {
    GetSettings().then((data) => {Object.assign(appSettings, data);});
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor)
    
    const cardsGo = await GetCards();
    cards.set(cardsGo.map(card =>
    new Card(card.ID, card.Name, card.InitialDial as dialTime, card.Dial as dialTime, card.TimeLeft, card.Order)));
    
    const alarmsGo = await GetAlarms();
    alarms.set(alarmsGo.map(alarmData => {
      const alarm = new Alarm(alarmData.ID, alarmData.Text, alarmData.Dial as [number, number, number, number], alarmData.Disabled, alarmData.WeekDays as weekDaysBool, alarmData.Order);
      if (!alarm.disabled) {alarm.timerToAlarm.start()};
      return alarm;
    }));
    
    const today = new Date();
    const isPastClearDate = (Date.now() >= new Date().setHours(appSettings.Focus.goal.clearHours, appSettings.Focus.goal.clearMinutes, 0, 0) &&
    appSettings.Focus.goal.monthDay[0] !== today.getMonth() && appSettings.Focus.goal.monthDay[1] !== today.getDate());
    
    const tasksGo = await GetTasks();
    tasks.set(tasksGo.map(taskData => {
      const task = new Task(taskData.ID, taskData.Text, taskData.Checked, taskData.TimeInitToSpend, taskData.TimeToSpend, taskData.Order);
      if (isPastClearDate) { task.checked=false, task.timeToSpend=0, task.order=0}
      if (task.checked) {tasksState.countChecked += 1}
      return task;
    }));
    
    if (isPastClearDate) {
      if ((appSettings.Focus.goal.dailyGoal <= Math.floor(appSettings.Focus.goal.completed / 60)) && (!appSettings.Focus.goal.includeWeekdays && today.getDay() < 5 ) || (appSettings.Focus.goal.includeWeekdays && today.getDay() > 4)) {
        appSettings.Focus.goal.streak += 1
      }
      appSettings.Focus.goal.yesterday = Math.floor(appSettings.Focus.goal.completed / 60)
      appSettings.Focus.goal.completed = 0
    }
    
    const debounceCards = debounce(() => SaveCard(getCards()))
    const debounceTasks = debounce(() => SaveTasks(getTasks()))
    const debounceAlarms = debounce(() => SaveAlarm(getAlarms()))
    cards.subscribe(debounceCards);
    tasks.subscribe(debounceTasks);
    alarms.subscribe(debounceAlarms);
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
    <div class={["background-img", { light: appSettings.Theme }]}></div>
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