<script lang="ts">
  import { writable } from "svelte/store";
  
  import type { dialTime } from "$lib/types/StoreComponentsTypes";
  
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import CircleProgress from "../timer/CircleProgress.svelte";
  import TopRightButton from "../TopRightButton.svelte";

  const progress = writable(0.5);
  const cardTime = writable([0, 0, 0, 0, 0, 0] as dialTime);

  let yesterday = 1;
  let streak = 3;
  let completed = "45 minutes";
</script>

<div class={["goal-comp", {light: appTheme.light}]}>
  <div class="header">
    <div class="name">Daily progress</div>
    <div class="top-buttons">
      <TopRightButton onClick={() => {}} icon="icons/focus/pen-fancy.svg" alt="settings" --end=16px />
    </div>
  </div>

  <div class="progress-content">
    <div class="side-column">
      <div class="label">Yesterday</div>
      <div class="value">{yesterday}</div>
      <div class="unit">hour</div>
    </div>

    <div class="circle-wrapper">
      <CircleProgress {progress} {cardTime} />
    </div>
    
    <div class="side-column" style:margin-right=16px>
      <div class="label">Streak</div>
      <div class="value">{streak}</div>
      <div class="unit">days</div>
    </div>
  </div>
  <div class="completed">Completed: {completed}</div>
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
  overflow: hidden;
  container-type: inline-size;
}

.goal-comp.light {
  background: rgb(225, 182, 175);
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
  width: 100%;
  height: 100%;
}

.completed {
  display: flex;
  position: relative;
  width: 100%;
  height: 10%;
  justify-content: center;
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

</style>