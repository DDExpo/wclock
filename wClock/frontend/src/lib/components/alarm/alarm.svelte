<script lang="ts">

  import AddForm from "../AddForm.svelte";
  import TopRightButton from "../TopRightButton.svelte";

  import type { dialTime, PropsAlarm, weekDaysBool } from "$lib/types/StoreComponentsTypes";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { deleteAlarm } from "$lib/stores/alarms.svelte";
  import { notDraggable } from "$lib/stores/timerWatch.svelte";
  
  let { alarm, alarmInd, timeTo }: PropsAlarm = $props();

  let showAlarmForm: boolean = $state(false);

  function hideShowAlarmForm() {
    alarm.timerToAlarm.stop()
    showAlarmForm = !showAlarmForm;
    notDraggable.dragg = showAlarmForm
  }

  function enableAlarm() {
    alarm.disabled = !alarm.disabled
    if (alarm.disabled) {alarm.timerToAlarm.stop()}
    else {alarm.timerToAlarm.start()}
  }

  function triggerSubscribe(i: number) {
    alarm.weekDays[i] = !alarm.weekDays[i];
    alarm.timerToAlarm.start()
  };

</script>


<div class={["alarm", { light: appTheme.light, disabled: alarm.disabled}]} draggable="false">
  <div class="alarm-header">
    <div class="top-buttons">
      <label class="switch">
        <input type="checkbox" checked={alarm.disabled} onchange={ enableAlarm } />
        <span class="slider"></span>
      </label>
      <TopRightButton onClick={ hideShowAlarmForm } icon="icons/buttons/edit.svg" alt="edit" --end=16px/>
      {#if showAlarmForm }
        <AddForm closeForm={ hideShowAlarmForm } formName="Save Alarm" ind={alarmInd} Text={alarm.text} Dial={alarm.dialNumber.concat([0, 0]) as dialTime} change={true} digitsLen={4} alarm={true}/>
      {/if}
      <TopRightButton onClick={() => { deleteAlarm(alarmInd, alarm.id) }} icon="icons/buttons/trash.svg" alt="delete" --end=16px/>
    </div>
  </div>

  <div class="alarm-dial">
    <div class="dial-digits">{alarm.dial}</div>
  </div>

  <div class="alarm-time-left">
    <img src="icons/bell.svg" alt="bell" class="bell-icon" />
    <span>{$timeTo}</span>
  </div>
  <div class="alarm-text">{alarm.text}</div>
  <div class="weekdays-buttons">
    {#each ['Su', 'Mn', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as day, ind}
      {#if alarm.weekDays !== undefined}
      <button class={["weekday-btn", { active: alarm.weekDays[ind] }]} onclick={() => triggerSubscribe(ind)}>
        {day}
      </button>
      {/if}
    {/each}
  </div>
</div>

<style>
.alarm {
  display: flex;
  flex-direction: column;
  justify-content: space-between;;
  height: clamp(190px, 25vw, 280px);
  width: clamp(230px, 45vw, 400px);
  justify-content: start;
  background: #373737;
  padding: 1rem;
  padding-left: 0rem;
  font-family: dark-theme-font;
  box-shadow: -4px 8px 8px rgba(23, 23, 23, 0.5);
  border-radius: 3px;
  position: relative;
}

.alarm.light {
  background: #DAAFAF;
  box-shadow: -4px 8px 8px rgba(97, 97, 97, 0.2);
  font-family: serif;
  border-radius: 15px;
}

.alarm.disabled {
  opacity: 0.5;
  pointer-events: none;
  filter: grayscale(0.7);
}

.alarm.disabled .switch{
  opacity: 1;
  pointer-events: visible;
}


.alarm-header {
  display: flex;
  justify-content: flex-end;
  margin-top: -4px;
  margin-right: -10px;
}

.top-buttons {
  display: flex;
}

.switch {
  position: relative;
  width: 30px;
  height:18px;
  pointer-events: all;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #a9a9a996;
  transition: background-color 0.3s ease;
  border-radius: 18px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 14px; width: 14px;
  left: 2px; bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

input:checked + .slider {
  transition: background-color 0.3s ease;
  background-color: #1f1f1f;
}

input:checked + .slider:before {
  transition: transform 0.3s ease;
  transform: translateX(12px);
}

.alarm-dial {
  display: flex;
  justify-content: start;
  margin-left: 1rem;
  text-shadow: -6px 8px 5px rgba(0, 0, 0, 0.3);
  align-items: center;
}

.alarm.light .alarm-dial {
  text-shadow: -6px 8px 5px rgba(0, 0, 0, 0.2);
}

.dial-digits {
  font-size: clamp(4rem, 6vw, 6rem);
  font-weight: bold;
  color: white;
}

.alarm-time-left {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: start;
  align-items: center;
  margin-left: 1rem;
  margin-bottom: 5px;
  font-size: clamp(1rem, 2vw, 1.5rem);
  filter: opacity(50%);
  color: white;
}

.bell-icon {
  width: clamp(0.7rem, 2vw, 1.2rem);
  margin-right: 0.3vw;
  filter: invert(100%) opacity(50%);
}

.alarm-text {
  display: flex;
  color: white;
  width: 100%;
  padding-left: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: clamp(1.5rem, 3vw, 2rem);
  text-shadow: -6px 8px 5px rgba(0, 0, 0, 0.3);
}

.weekdays-buttons {
  display: flex;
  justify-content: center;
  width: 75%;
  align-items: center;
  justify-content: space-between;
  margin-left: 10px;
  margin-top: 10px;
  gap: 3px;
}

.weekday-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(1.5rem, 4vw, 2.3rem);
  height: clamp(1.5rem, 4vw, 2.3rem);
  border-radius: 50%;
  background: #666;
  color: white;
  border: none;
  font-family: dark-theme-font;
  font-size: clamp(0.7rem, 2vw, 1.3rem);
  cursor: pointer;
  transition: background 0.2s, transform 0.3s ease;
  margin-top: clamp(0px, 1vw, -20px);
  box-shadow: -6px 8px 5px rgba(0, 0, 0, 0.1);
}
.weekday-btn:hover {
  background: #afb9f2a8;
  transform: translateY(-2px);
}

.weekday-btn.active {
  background: #327a45;
  transform: translateY(0px);
}

.weekday-btn.active:hover {
  background: #afb9f2a8;
}

.alarm.light .weekday-btn {
  background: #8c7676;
  color: rgb(255, 255, 255);
  font-family: serif;
  box-shadow: -4px 5px 6px rgba(72, 72, 72, 0.25);
}

.alarm.light .weekday-btn.active {
  background: #327a45;
}

.alarm.light .weekday-btn:hover {
  background: rgba(198, 213, 239, 0.656);
}
</style>