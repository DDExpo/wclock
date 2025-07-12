<script lang="ts">

  import { appTheme, isAlwaysOnTop } from "$lib/stores/sideBarAndTheme.svelte";
  import { stopWatch, markers, watchState} from "$lib/stores/stopWatch.svelte";
  import { SetWindowAlwaysOnTop, MakeMiniWindowSize } from "$lib/wailsjs/go/main/App";

  document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);

  function makeMiniWindow() {
    console.log(watchState.isCompact)
    if (!watchState.isCompact) {
      watchState.isCompact = true;
      MakeMiniWindowSize(180, 180, watchState.isCompact)
      SetWindowAlwaysOnTop(true);
      isAlwaysOnTop.onTop = true;
      
    } else {
      watchState.isCompact = false;
      MakeMiniWindowSize(356, 356, watchState.isCompact)
      SetWindowAlwaysOnTop(false);
      isAlwaysOnTop.onTop = false;
    };
  };

  function startStopWatch() {
    if (!watchState.isRunning) {
      watchState.isRunning = true;
      stopWatch.start();
    } else {
      watchState.isRunning = false; 
      stopWatch.stop();
    };
  };

  function makeSnapshot() {
    const { h1, h, m1, m, s1, s, ms1, ms} = $stopWatch;
    stopWatch.cleanDial();
    if (h1 | h | m1| m | s1 | s | ms) {
      markers.update(t => {
        let ms1String = String(ms1).padStart(2, '0')
        t.push([`${h1}${h}`,`${m1}${m}`,`${s1}${s}`,`${ms1String}`].join(':'));
        return t;
    })}
  };

  function resetStopWatch() {
    if (watchState.isCompact) {
      stopWatch.cleanDial();
    } else {
      watchState.isRunning = false
      stopWatch.reset();
    };
  }

</script>

<div class="stopwatch-page">
  <div class="stopwatch-content" class:compact={watchState.isCompact}>
    <div class="stopwatch-dial" class:light={appTheme.isLight}  >
      <button class="mini-window-btn" onclick="{makeMiniWindow}" class:compact="{watchState.isCompact}"><img src="icons/stopwatch/arrow-up-right-from-square.svg" alt="Mini window" /></button>
      {$stopWatch.h1}{$stopWatch.h}:{$stopWatch.m1}{$stopWatch.m}:{$stopWatch.s1}{$stopWatch.s}<span class="small-dots">:</span><span class="time-part small">{ $stopWatch.ms1 }</span>
      <div class="stopwatch-buttons">
        <button class="circle-button"class:is-running={watchState.isRunning} onclick={startStopWatch}>
          {#if !watchState.isRunning}<img src="icons/stopwatch/play.svg" alt="start" />
          {:else}<img src="icons/stopwatch/pause.svg" alt="pause" />{/if}
        </button>
        {#if !watchState.isCompact}
          <button class="circle-button" onclick={makeSnapshot}><img src="icons/stopwatch/map-pin.svg" alt="end"/></button>
        {/if}
        <button class="circle-button" onclick={resetStopWatch}>
          <img src="icons/stopwatch/reset.svg" alt="reset" style="margin-bottom: 3px"/>
        </button>
      </div>
    </div>
    {#if !watchState.isCompact}
      <div class="stop-markers" class:light={appTheme.isLight}>
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
      {/if}
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
  margin-top: 30rem;
  width: 100%;
  height: 100%;
}

.stopwatch-content.compact {
  margin-left: 0px;
  margin-top: 40px;

}

.stopwatch-content.compact .stopwatch-dial {
  font-size: 2rem;
}

.stopwatch-dial {
  font-size: clamp(2.5rem, 10vw, 190px);
  align-items: baseline;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
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

.stopwatch-dial.light .mini-window-btn img {
  filter: invert(10%) opacity(30%);
}

.mini-window-btn {
  position: relative;
  display: block;
  left: 26px;
  justify-self: end;
  background: none;
  border: none;
}

.mini-window-btn.compact {
  left: 10px;
}

.mini-window-btn img {
  width: clamp(12px, 2.5vw, 26px);
  filter:  invert(90%) opacity(30%);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.mini-window-btn.compact img {
  transform: rotate(180deg);
}

.mini-window-btn.compact img:hover {
  transform: scale(1.5);
  transform: rotate(180deg);
}

.mini-window-btn img:hover {
  transform: scale(1.5);
}

.small-dots {
  font-size: 0.8em;
}

.time-part.small {
  font-size: 0.8em;
  display: inline-block;
  min-width: 2ch;
  text-align: right;
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
  cursor: pointer;
}

.stop-markers {
  font-family: dark-theme-font;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  color: #eee;
  max-height: 40vh;
  margin-bottom: 2vh;
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

.stop-markers::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.stop-markers::-webkit-scrollbar-track {
  background: transparent;
}
.stop-markers::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
.stop-markers::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.stop-markers {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.stop-markers.light::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
.stop-markers.light::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

.stop-markers.light {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

@media (max-height: 724px) {
  .stopwatch-content {
    margin-top: 20rem;
  }
}
@media (max-height: 512px) {
  .stopwatch-content {
    margin-top: 10rem;
  }
}
</style>
