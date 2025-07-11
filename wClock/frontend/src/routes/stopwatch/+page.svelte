<script lang="ts">

  import { isLightTheme } from "$lib/stores/themes";
  import { userWindowsPcColor } from "$lib/stores/themes";
  import { stopWatch } from "$lib/stores/stopWatch";
  import { markers } from "$lib/stores/stopWatch";

  document.documentElement.style.setProperty('--user-pc-color', $userWindowsPcColor);

  let isRunning: boolean = $state(false)

  function startStopWatch() {
    if (!isRunning) {
      isRunning = true;
      stopWatch.start();
    } else {
      stopWatch.stop();
      isRunning = false;
    };
  };

  function makeSnapshot() {
    const { h1, h, m1, m, s1, s, ms } = $stopWatch;
    if (h1 | h | m1| m | s1 | s | ms) {
      markers.update(t => {
        t.push([`${h1}${h}`,`${m1}${m}`,`${s1}${s}`,`${ms}`.padStart(2, '0')].join(':'));
        return t;
    })}
  };

  function resetStopWatch() {
    isRunning = false
    stopWatch.reset()
  }

</script>

<div class="stopwatch-page">
  <div class="stopwatch-content">
    <div class="stopwatch-dial" class:light={$isLightTheme}>
      <span class="time-part">{$stopWatch.h1}{$stopWatch.h}</span>
      <span class="colon">:</span>
      <span class="time-part">{$stopWatch.m1}{$stopWatch.m}</span>
      <span class="colon">:</span>
      <span class="time-part">{$stopWatch.s1}{$stopWatch.s}</span>
      <span class="colon small">:</span>
      <span class="time-part small">{$stopWatch.ms}</span>
      <div class="stopwatch-buttons">
        <button class="circle-button"class:is-running={isRunning} onclick={startStopWatch}>
          {#if !isRunning}<img src="icons/stopwatch/play.svg" alt="start" />
          {:else}<img src="icons/stopwatch/pause.svg" alt="pause" />{/if}
        </button>
        <button class="circle-button" onclick={makeSnapshot}><img src="icons/stopwatch/map-pin.svg" alt="end"/></button>
        <button class="circle-button" onclick={resetStopWatch}>
          <img src="icons/stopwatch/reset.svg" alt="reset" style="margin-bottom: 3px"/>
        </button>
      </div>
    </div>
    <div class="stop-markers" class:light={$isLightTheme}>
      <div class="titles">   
        <span>Laps</span>
        <span>Time</span>
      </div>
      {#each $markers.slice().reverse() as mark, i }
        <div class="markers-row">
          <span>{ $markers.length - i }</span>
          <span>{ mark }</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>

.stopwatch-page {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.stopwatch-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 60px;
  margin-top: 160px;
  width: 100%;
  height: 100%;
}

.stopwatch-dial {
  font-size: clamp(2.5rem, 10vw, 190px);
  align-items: baseline;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  margin-top: 10px;
  gap: 0.4em;
  color: #eee;
  font-family: dark-theme-font;
}
.stopwatch-dial.light {
  font-family: serif;
  color: #3B2F2F;
}
.stopwatch-dial.light .circle-button {
  background-color: #e8eeffc6;
}
.stopwatch-dial.light .circle-button:hover {
  background-color: #FFF0A4;
}
.stopwatch-dial.light .circle-button.is-running {
  background-color: #b0f8b6;
}
.stopwatch-dial.light .circle-button.is-running:hover {
  background-color: #FFF0A4;
}

.stopwatch-dial.light img {
  filter: invert(10%) opacity(80%);
}

.time-part {
  font-variant-numeric: tabular-nums;
}
.time-part.small {
  font-size: 0.4em;
  transform: translateY(30%);
  display: inline-block;
  min-width: 3ch;
  text-align: right;
}
.colon {
  font-size: 0.8em;
  opacity: 0.7;
}
.colon.small {
  font-size: 0.5em;
  transform: translateY(40%);
}


.stopwatch-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.circle-button {
  width: clamp(30px, 6vw, 60px);
  height: clamp(30px, 6vw, 60px);
  border-radius: 50%;
  border: transparent;
  background-color: #2f2f2f;
  display: flex;
  margin-top: 1vh;
  margin-bottom: 3vw;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 6px #0004;
}
.circle-button:hover {
  background: #6b6b6b;
  border: 2px inset var(--user-pc-color);
}
.circle-button.is-running {
  background-color: #6b6b6b;
}

.circle-button img {
  width: 55%;
  height: 55%;
  filter: invert(90%) opacity(90%);
  object-fit: contain;
}

.stop-markers {
  font-family: dark-theme-font;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  color: #eee;
  max-height: 40vh;
  overflow-y: auto;
}

.stop-markers.light {
  color: #3B2F2F;
  font-family: serif;
}

.stop-markers.light .titles {
  border-bottom: 3px solid rgb(55, 50, 50);
}

.titles {
  display: grid;
  width: 80%;
  font-size: medium;
  font-weight: bold;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 1px;
  align-self: center;
  border-bottom: 3px solid #ffffff;
}

.markers-row {
  display: grid;
  width: 80%;
  align-self: center;
  margin-top: 20px;
  font-size: medium;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--user-pc-color,);
}

.titles span:nth-child(1),
.markers-row span:nth-child(1) {
  text-align: left;
}

.titles span:nth-child(2),
.markers-row span:nth-child(2) {
  text-align: right;
}

</style>
