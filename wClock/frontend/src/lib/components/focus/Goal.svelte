<script lang="ts">
  import { writable } from "svelte/store";
  
  import type { dialTime } from "$lib/types/StoreComponentsTypes";

  import CircleProgress from "../timer/CircleProgress.svelte";
  import TopRightButton from "../TopRightButton.svelte";

  import { appSettings, validateSettings } from "$lib/stores/utils.svelte";
  import { goalCardState } from "$lib/stores/focusState.svelte";

  import { GiveNewSettings } from '$lib/wailsjs/go/main/App';

  let isNotValidSettings: boolean = $state(false)

  const progress = $derived(appSettings.Focus.goal.completed/(appSettings.Focus.goal.dailyGoal*60));
  const time = writable([0, 0, 0, 0, 0, 0] as dialTime);

  function saveValidateyGoalState() {
    isNotValidSettings = validateSettings(true)
    console.log(appSettings.Focus.goal.dailyGoal)
    if (!isNotValidSettings) {
      GiveNewSettings({ goal: appSettings.Focus.goal })
    };
  }

</script>

<div class={["goal-comp", {light: appSettings.Theme, flipped:goalCardState.isFlipped }]}>
  <div class="header">
    <div class="name">Daily progress</div>
    <div class="top-buttons">
      <TopRightButton onClick={() => goalCardState.isFlipped = !goalCardState.isFlipped } icon="icons/focus/pen-fancy.svg" alt="settings" --end=16px />
    </div>
  </div>
  <div class="flipper">
    <div class="front">
      <div class="progress-content">
        <div class="side-column">
          <div class="label">Yesterday</div>
          <div class="value">{appSettings.Focus.goal.yesterday}</div>
          <div class="unit">hour</div>
        </div>
        <div class="circle-wrapper">
          <CircleProgress progress={writable(progress)} goal={appSettings.Focus.goal.dailyGoal} focus={true} />
        </div>
        <div class="side-column" style:margin-right=16px>
          <div class="label">Streak</div>
          <div class="value">{appSettings.Focus.goal.streak}</div>
          <div class="unit">days</div>
        </div>
      </div>
      <div class="completed">Completed: {appSettings.Focus.goal.completed} minutes</div>
    </div>

    <div class="back">
      <div class={["edit-goal-form", { valid: isNotValidSettings }]}>

        <label class="field">
          <span class="title">Daily goal</span>
          <div class="wrapper-daily">
            <input class="daily-hours" type="text" bind:value={appSettings.Focus.goal.dailyGoal} placeholder="0"/>
            <span>Hours</span>
          </div>
        </label>

        <label class="field">
          <span style:color=inherit>Clear daily progress and completed tasks</span>
          <div class="time-select">
            <input type="text" bind:value={appSettings.Focus.goal.clearHours} placeholder="  0"/> <span>hours</span>
            <input type="text" bind:value={appSettings.Focus.goal.clearMinutes} placeholder="  0"/> <span>minutes</span>
          </div>
        </label>

        <label class="checkbox">
          <input type="checkbox" bind:checked={appSettings.Focus.goal.includeWeekdays}>
          <span>Include weekends in streaks</span>
        </label>

        <div class="buttons">
          <button class="save" onclick={ saveValidateyGoalState }>
            <img src="icons/focus/disk.svg" alt="save icon" />
            Save
          </button>
          <button class="cancel" onclick={() => goalCardState.isFlipped = !goalCardState.isFlipped }>
            Cancel
          </button>
        </div>
      </div>
    </div>

  </div>
</div>
<style>

.goal-comp {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  background: rgb(33, 33, 33);
  user-select: none;
  container-type: inline-size;
  perspective: 1000px;
  overflow-y: scroll;
  scrollbar-width: none;
}

.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.goal-comp.flipped .flipper {
  transform: rotateY(180deg);
}

.front {
  position: relative;
  width: 100%;
  height: 90%;
  max-height: fit-content;
  backface-visibility: hidden;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
  backface-visibility: hidden;
  align-content: center;
  justify-items: center;
}

.goal-comp.flipped {
  transform: rotateY(0);
}

.goal-comp.light {
  background: #E1B6AF;
}

.goal-comp.light .unit,
.goal-comp.light .completed {
  color: #434343b1;

}

.header {
  display: flex;
  width: 100;
  padding: 0.7rem;
  align-items: center;
  justify-content: space-between;
}

.name {
  font-weight: bold;
  font-size: 1.1rem;

}

.top-buttons {
  display: flex;
  justify-content: end;
}

.progress-content {
  display: flex;
  position: relative;
  flex: 1;
  height: 100%;
  width: 100%;
  padding-right: 1rem;
  padding-left: 0.5rem;
  align-items: center;
  gap: 5px;
}

.side-column {
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  color: white;
}

.label {
  display: flex;
  position: relative;
  font-weight: bold;
  margin-bottom: 0.2rem;
}

.value {
  position: relative;
  display: flex;
  font-weight: bold;
}

.unit {
  position: relative;
  color: rgba(234, 234, 234, 0.322);
}

.circle-wrapper {
  display: flex;
  position: relative;
  color: inherit;
  width: 100%;
  height: 100%;
}

.completed {
  display: flex;
  position: relative;
  width: 100%;
  height: fit-content;
  justify-content: center;
  align-content: start;
  color: rgba(234, 234, 234, 0.276);
}

.label,
.value,
.unit {
  font-size: clamp(0.8rem, 2.5vw, 2rem);
}

@container (min-width: 0px) {
  .label,
  .value,
  .unit,
  .completed {
    font-size: clamp(12px, 5cqw, 50px);
  }
  .completed {
    margin-left: clamp(5px, 2cqw, 25px);
  }
}

.goal-comp.light .edit-goal-form {
  border: 0.7cqw solid rgba(0, 0, 0, 0.37);
  border-radius: 15px;
  box-shadow: 0px 1cqw 1px rgba(0, 0, 0, 0.45);
  justify-content: center;
}
.goal-comp.light .edit-goal-form .field span,
.goal-comp.light .edit-goal-form .field .title {
  color: #3b2f2fc5;
} 
.goal-comp.light .edit-goal-form .field .time-select input,
.goal-comp.light .edit-goal-form .field .daily-hours {
  background: rgba(255, 255, 255, 0.244);
}

.edit-goal-form {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  gap: 1rem;
  width: 85%;
  height: 85%;
  border: 0.7cqw solid #6FD7F7;
  box-shadow: 0px 1cqw 0px #6FD7F7;
  justify-content: center;
  align-items: center;
  overflow-y: scroll;
  scrollbar-width: none;
  container-type: inline-size;
}

.edit-goal-form .title {
  font-weight: bolder;
  font-size: clamp(5px, 10cqw, 40px);
  text-align: center;
  color: white;
}
.goal-comp.light .edit-goal-form.valid .field input,
.edit-goal-form.valid input {
  background: rgba(255, 0, 0, 0.464);
}

.goal-comp.light .edit-goal-form .time-select input {
  border-bottom: 1cqw solid rgb(163, 120, 244);
  color: #151515;

}
.goal-comp.light .edit-goal-form .field .wrapper-daily {
  border: 0.7cqw solid rgb(163, 120, 244);
  color: #3B2F2F;
  border-bottom: 2cqw solid rgb(163, 120, 244);
}

.field {
  display: flex;
  color: inherit;
  flex-direction: column;
  font-size: clamp(5px, 5cqw, 30px);
  gap: 0.3em;
  align-items: center;
}

.field span {
  text-align: center;
  color: white;
}

.wrapper-daily {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7em;
  padding: 0.5em 1em;
  border: 0.7cqw solid rgba(164, 237, 238);
  border-bottom: 2cqw solid rgb(164, 237, 238);
  border-radius: clamp(0.5rem, 5cqw, 3rem);
  width: 50%;
  box-sizing: border-box;
}

.field .daily-hours {
  all: unset;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.3em;
  padding: 0.3em 0.5em;
  width: 100%;
  cursor: pointer;
}

.time-select {
  display: flex;
  gap: 1em;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.time-select input {
  all: unset;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.3em;
  border-bottom: 0.7cqw solid rgba(164, 237, 238, 1);
  text-align: center;
  width: 10%;
  padding: 0.2em 0.4em;
  color: inherit;
  font-size: inherit;
  box-sizing: border-box;
  cursor: pointer;
}

.checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.checkbox span {
 font-size:  clamp(8px, 4cqw, 20px);
}

.buttons {
  display: flex;
  justify-content: center;
}

button img {
  width: clamp(10px, 5cqw, 16px);
  height: clamp(10px, 5cqw, 16px);
  filter: invert(90);
}

button {
  background: transparent;
  color: white;
  font-size: clamp(10px, 5cqw, 20px);
  font-weight: bold;
  font-family: dark-theme-font;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0px 3px 0px rgba(164, 237, 238, 1);
  cursor: pointer;
}

.goal-comp.light button {
  font-family: serif;
  color: #3B2F2F;
  box-shadow: 0px 3px 0px rgb(163, 120, 244);
}

.goal-comp.light button img {
  filter: invert(10%) opacity(85%);
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 0px rgba(164, 237, 238, 1);
}

.goal-comp.light button:hover {
  box-shadow: 0px 6px 0px rgb(252, 194, 107);
}

button:active {
  transform: translateY(0);
  box-shadow: 0px 6px 0px rgb(236, 195, 35);
}

.goal-comp.light button:active {
  transform: translateY(0px);
  box-shadow: 0px 6px 0px #8edb88;
}

</style>