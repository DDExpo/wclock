<script lang="ts">
  import '../app.css';
  
  import { onMount } from "svelte";
  
  import type { dialTime, weekDaysBool } from "$lib/types/StoreComponentsTypes";
  
  import SideBar from "$lib/components/SideBar.svelte";
  import TopBar from "$lib/components/TopBar.svelte";

  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { appSettings, debounce, getAlarms, getCards, getTasks, watchState } from "$lib/stores/utils.svelte";
  import { GetWindowsPcColors, GetSettings, DBSave, DBGet } from "$lib/wailsjs/go/main/App";
  import { alarms } from "$lib/stores/alarms.svelte";
  import { cards } from "$lib/stores/timerWatch.svelte";
  import { tasks, tasksState } from '$lib/stores/focusState.svelte';
  import { Card } from "$lib/stores/class/ClassCard.svelte";
  import { Task } from "$lib/stores/class/ClassTask.svelte";
  import { Alarm } from "$lib/stores/class/ClassAlarms.svelte";
  import { gofunc } from '$lib/wailsjs/go/models';

	let { children } = $props();    
  
  onMount(async() => {
    GetSettings().then((data) => {Object.assign(appSettings, data);});
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor)
    
    const cardsGo = (await DBGet("cards")).Cards;
    cards.set(cardsGo.map(card =>
    new Card(card.ID, card.Name, card.InitialDial as dialTime, card.Dial as dialTime, card.TimeLeft, card.Order)));
    
    const alarmsGo = (await DBGet("alarms")).Alarms;
    alarms.set(alarmsGo.map(alarmData => {
      const alarm = new Alarm(alarmData.ID, alarmData.Text, alarmData.Dial as [number, number, number, number], alarmData.Disabled, alarmData.WeekDays as weekDaysBool, alarmData.Order);
      if (!alarm.disabled) {alarm.timerToAlarm.start()};
      return alarm;
    }));
    
    const today = new Date();
    const isPastClearDate = (Date.now() >= new Date().setHours(appSettings.Focus.goal.clearHours, appSettings.Focus.goal.clearMinutes, 0, 0) &&
    appSettings.Focus.goal.monthDay[0] !== today.getMonth() || appSettings.Focus.goal.monthDay[1] !== today.getDate());

    const tasksGo = (await DBGet("tasks")).Tasks;
    tasks.set(tasksGo.map((taskData, ind) => {
      const task = new Task(taskData.ID, taskData.Text, taskData.Checked, taskData.TimeToSpend, taskData.TimeInitToSpend, taskData.Order, taskData.Completed);
      if (task.timeToSpend !== task.timeInitToSpend) {task.tweenTime.set((task.timeToSpend/task.timeInitToSpend)*100)}
      if (isPastClearDate) { task.checked=false, task.timeToSpend=task.timeInitToSpend, task.order=0, task.completed=false, task.tweenTime.set(0)};
      if (task.checked) {tasksState.countChecked += 1, tasksState.checkedIndex.add(ind)};
      if (task.completed) {task.tweenTime.set(100);};
      return task;
    }));
    
    if (isPastClearDate) {
      if ((appSettings.Focus.goal.dailyGoal <= Math.floor(appSettings.Focus.goal.completed / 60)) && (!appSettings.Focus.goal.includeWeekdays && today.getDay() < 5 ) || (appSettings.Focus.goal.includeWeekdays && today.getDay() > 4)) {
        appSettings.Focus.goal.streak += 1
      }
      appSettings.Focus.goal.yesterday[0] = appSettings.Focus.goal.yesterday[1]
      appSettings.Focus.goal.yesterday[1] = 0
      appSettings.Focus.goal.completed = 0
    }

    const debounceCards = debounce(() => DBSave("cards", gofunc.ItemsDB.createFrom({ "Cards": getCards() })))
    const debounceTasks = debounce(() => DBSave("tasks", gofunc.ItemsDB.createFrom({ "Tasks": getTasks() })))
    const debounceAlarms = debounce(() => DBSave("alarms", gofunc.ItemsDB.createFrom({ "Alarms": getAlarms() })))
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