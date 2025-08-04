<script lang="ts">
  import { onMount } from 'svelte';

  import { appSettings } from '$lib/stores/utils.svelte';
  import { focusCardState, focusWatch } from '$lib/stores/focusState.svelte';
  
  let minutes = $derived(appSettings.Focus.focus.minutes % 60)
  let hours = $derived(Math.floor(appSettings.Focus.focus.minutes / 60))
  let breaks = $derived(Math.floor(appSettings.Focus.focus.minutes / appSettings.Focus.focus.breaksAtEvery))
  let curBreaks = $derived(Math.floor((appSettings.Focus.focus.minutes - appSettings.Focus.focus.curMinutes) / appSettings.Focus.focus.breaksAtEvery))

  function stopWatch() {
    if (focusCardState.sessionIsOnBreak) {focusWatch.stopBreak()}
    else {focusWatch.stop()};
  }

  function fullStopWatch() {
    appSettings.Focus.focus.curMinutes = 0;
    focusCardState.sessionStarted = false;
    stopWatch();
  };

</script>

<div class={["clock-container", {light: appSettings.Theme}]}>

  <div class="header">
    <div >Focus period: {curBreaks} of {breaks}</div>
  </div>
  
  <div class="time-row minute-row">
    <div class="track minute-track" style:animation-iteration-count={minutes}, style:--offset={minutes*100}px>
      {#each Array.from({length: 180}, (_, i) => i % 60) as minute}
        <span>{minute}</span>
      {/each}
    </div>
    <div class="minute-frame">
      <div class="frame-text">MINUTE</div>
    </div>
  </div>
  
  <div class="time-row hour-row">
    <div class="track hour-track" style:animation-iteration-count={hours}, style:--offset={hours*120}px>
      {#each Array.from({length: 72}, (h, i) => i % 24) as hour}
        <span>{hour}</span>
      {/each}
    </div>
    <div class="hour-frame">
      <div class="frame-text">HOUR</div>
    </div>
  </div>
  
  <div class="time-row second-row">
    <div class="track second-track" style:animation-iteration-count={appSettings.Focus.focus.minutes}>
      {#each Array.from({length: 180}, (_, i) => i % 60) as second}
        <span>{second}</span>
      {/each}
    </div>
    <div class="second-frame">
      <div class="frame-text">SECOND</div>
    </div>
  </div>

  {#if !appSettings.Focus.focus.skipBreaks}
    {#if focusCardState.sessionIsOnBreak}
      <div class="next">
          Up next: {appSettings.Focus.focus.breaksAtEvery} minutes session
      </div>
    {:else}
      <div class="next">
        Up next: {appSettings.Focus.focus.breaksTime} minutes break
      </div>
    {/if}
  {/if}

  <div class="button-container">
    <button class="engraved-button" onclick={ stopWatch }>Stop</button>
    <button class="engraved-button" onclick={ fullStopWatch }>Full Stop</button>
  </div>

</div>

<style>

.clock-container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 25px;
  margin-top: 20px;
  align-items: center;
  flex-direction: column;
}
.header {
  display: flex;
  position: relative;
  z-index: 1;
  width: 100%;
  margin-left: 2rem;
  margin-top: 0.7rem;
  margin-bottom: -10px;
  align-items: center;
  justify-content: start;
}

.time-row {
  margin-left: 218px;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
}
.track {
  width: 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0px 5px 3px rgba(0, 0, 0, 0.4);
  transition: transform 1s cubic-bezier(1, 0, 0.95, 0);
  border-radius: 4px;
}

.clock-container.light .track.hour-track {
  background: linear-gradient(145deg, #fffffff0, #fff3ebaf);
  box-shadow:
  0 8px 16px rgba(255, 122, 54, .35),
  0 4px 6px  rgba(255, 122, 54, .25),
  inset 0 1px 0 rgba(255, 255, 255, .9),
  inset 0 -1px 0 rgba(255, 122, 54, .25);
}
.clock-container.light .track.minute-track {
  background: linear-gradient(145deg,#fff8f2, #ffd7b9);
  box-shadow:
  0 6px 12px rgba(255, 122, 54, .30),
  0 3px 5px  rgba(255, 122, 54, .20),
  inset 0 1px 0 rgba(255, 255, 255, .9),
  inset 0 -1px 0 rgba(255, 122, 54, .20);
}
.clock-container.light .track.second-track {
  background: linear-gradient(145deg, #fff5ef, #fbc49af7);
  box-shadow:
  0 4px 8px  rgba(255, 122, 54, .25),
  0 2px 4px  rgba(255, 122, 54, .15),
  inset 0 1px 0 rgba(255, 255, 255, .9),
  inset 0 -1px 0 rgba(255, 122, 54, .15);
}
.clock-container.light span {
  color: #291201cd;
  font-weight: bold;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
}

.hour-track {
  height: 72px;
  background: linear-gradient(145deg, #2f2f2f, #1d1d1d);
  box-shadow:
  0 8px 16px rgba(0,0,0,.6),
  0 4px 6px rgba(0,0,0,.4),
  inset 0 1px 0 rgba(255,255,255,.05),
  inset 0 -1px 0 rgba(0,0,0,.4);
  right: 18%;
  animation: scroll-hours 86400s linear;
}

.minute-track {
  height: 60px;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  box-shadow:
  0 6px 12px rgba(0,0,0,.5),
  0 3px 5px rgba(0,0,0,.3),
  inset 0 1px 0 rgba(255,255,255,.05),
  inset 0 -1px 0 rgba(0,0,0,.35);
  right: 18%;
  animation: scroll-minutes 3600s linear;
}

.second-track {
  height: 48px;
  background: linear-gradient(145deg, #252525, #171717);
  box-shadow:
  0 4px 8px rgba(0,0,0,.4),
  0 2px 4px rgba(0,0,0,.25),
    inset 0 1px 0 rgba(255,255,255,.05),
    inset 0 -1px 0 rgba(0,0,0,.3);
  right: 18%;
  animation: scroll-seconds 60s linear;
}
  
@keyframes scroll-seconds {
  from { transform: translateX(0); }
  to   { transform: translateX(5400px); }
}

@keyframes scroll-minutes {
  from { transform: translateX(var(--offset)); }
  to   { transform: translateX(var(--offset)+6000px); }
}

@keyframes scroll-hours {
  from { transform: translateX(var(--offset)); }
  to   { transform: translateX(var(--offset)+6600px); }
}

span {
  color: #fff;
  display: flex;
  flex-shrink: 0;
  font-weight: bold;
  align-items: center;
  justify-content: center;
}

.hour-track span   { width: 110px; font-size: 44px; }
.minute-track span { width: 100px;  font-size: 32px; }
.second-track span { width: 90px; font-size: 24px; }

.second-frame, 
.minute-frame,
.hour-frame {
  top: 50%;
  left: 49.03%;
  width: 100px;
  height: calc(100% + 16px);
  border: 8px solid #786744;
  z-index: 10;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  pointer-events: none;
  box-shadow: inset 2px 3px 5px 3px #17171790;
}

.hour-frame {
  left: 49.3%;
  width: 120px;
}
.second-frame {
  width:90px;
  left: 48.95%;
}

.frame-text {
  left: 50%;
  color: #f7ebbc;
  bottom: -19px;
  padding: 2px 12px;
  position: absolute;
  font-size: 12px;
  transform: translateX(-50%);
  background: #786744;
  font-weight: bold;
  letter-spacing: 1px;
}

.clock-container.light .frame-text {
  font-size: 10px;
}

.minute-frame .frame-text {
  left: 40%;
}

.next {
  font-size: larger;
  text-align: center;
}

.button-container {
  display: flex;
  gap: 0.5rem;
  margin-top: -15px;
  justify-content: center;
}

.engraved-button {
  padding: 0.8rem 1.6rem;
  font-size: clamp(14px, 4cqw, 18px);
  color: inherit;
  background: linear-gradient(145deg, #2f2f2f, #1d1d1d);
  border: none;
  border-radius: 10px;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(60, 60, 60, 0.2);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: bold;
  font-family: inherit;
}

.engraved-button:hover {
  background: linear-gradient(145deg, #3a3a39, #222221);
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.7), inset -2px -2px 5px rgba(60, 60, 60, 0.25);
}

.engraved-button:active {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.8), inset -4px -4px 8px rgba(60, 60, 60, 0.15);
  transform: translateY(2px);
}

.clock-container.light .engraved-button {
  background: linear-gradient(145deg, #edd1b5d3, #dbaa7fa4);
  border-radius: 10px;
  box-shadow: inset 3px 3px 6px rgba(100, 60, 30, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.3);
}

.clock-container.light .engraved-button:hover {
  background: linear-gradient(145deg, #f7e0cda5, #f7d9baab);
  box-shadow: inset 2px 2px 5px rgba(100, 60, 30, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.4);
}

.clock-container.light .engraved-button:active {
  box-shadow: inset 4px 4px 8px rgba(100, 60, 30, 0.7), inset -4px -4px 8px rgba(255, 255, 255, 0.2);
  transform: translateY(2px);
}

</style>
