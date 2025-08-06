<script lang="ts">
  
  import CircleButton from "$lib/components/CircleButton.svelte";
  import TopRightButton from "$lib/components/TopRightButton.svelte";
  
  import { stopWatch, markers, stopWatchState } from "$lib/stores/stopWatch.svelte";
  import { appSettings, makeMiniWindow } from "$lib/stores/utils.svelte";

  let stopWatchCompact = $state(false)

  function makeWindowCompact() {
    stopWatchCompact = !stopWatchCompact
    makeMiniWindow(stopWatchCompact)
  }

  function startStopWatch() { 
    if (!stopWatchState.running) {stopWatch.start();
    } else {stopWatch.stop();};
    stopWatchState.running = !stopWatchState.running
  };

  function makeSnapshot() {
    const { h1, h, m1, m, s1, s, ms1, ms} = $stopWatch;
    stopWatch.cleanDial();
    if (h1 | h | m1| m | s1 | s | ms) {
      markers.update(t => {
        const ms1String = String(ms1).padStart(2, '0')
        t.push([`${h1}${h}`,`${m1}${m}`,`${s1}${s}`,`${ms1String}`].join(':'));
        return t;
    })}
  };

  function resetStopWatch() {
    if (stopWatchCompact) {
      stopWatch.cleanDial();
    } else {
      stopWatchState.running = false
      stopWatch.reset();
    };
  }

</script>

<div class="stopwatch-page">
  <div class={["stopwatch-content", { compact: stopWatchCompact }]}>
    <div class={["stopwatch-dial", { light: appSettings.Theme }]}>
      <TopRightButton onClick={ makeWindowCompact } icon="icons/buttons/arrow-up-right-from-square.svg" alt="Compact mode" compact={stopWatchCompact} --left="15px"/>
      {$stopWatch.h1}{$stopWatch.h}:{$stopWatch.m1}{$stopWatch.m}:{$stopWatch.s1}{$stopWatch.s}<span class="small-dots">:</span><span class="time-part small">{$stopWatch.ms1}</span>
      <div class="stopwatch-buttons">
        <CircleButton 
          onClick={ startStopWatch }
          icon={stopWatchState.running ? "icons/buttons/pause.svg" : "icons/buttons/play.svg"}
          alt={stopWatchState.running ? "pause" : "start"}
          isRunning={stopWatchState.running} />
          {#if !stopWatchCompact}
            <CircleButton onClick={ makeSnapshot } icon="icons/buttons/map-pin.svg" alt="snapshot"/>
          {/if}
        <CircleButton onClick={ resetStopWatch } icon="icons/buttons/reset.svg" alt="reset"/>
      </div>
    </div>
    <div class={["stop-markers", { light: appSettings.Theme, compact: stopWatchCompact }]}>
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
  margin-top: 30rem;
  width: 100%;
  height: 100%;
  transition: margin-top 0.5s ease;
}
.stopwatch-content.compact {
  margin-left: 0px;
  margin-top: 90px;

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
  text-shadow: -6px 8px 5px rgba(0, 0, 0, 0.3);
  font-family: dark-theme-font;
}
.stopwatch-dial.light {
  font-family: serif;
  color: #3B2F2F;
  text-shadow: -6px 8px 7px rgba(23, 23, 23, 0.2);
}

.small-dots {
  font-size: 0.8em;
}

.time-part.small {
  font-size: 0.8em;
  display: inline-block;
  min-width: 2.5ch;;
  text-align: center;
}

.stopwatch-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
  text-shadow: -6px 4px 2px rgba(0, 0, 0, 0.3);
}

.stop-markers.compact {
  margin-top: 40px;
}

.stop-markers.light {
  color: #3B2F2F;
  text-shadow: -6px 4px 3px rgba(23, 23, 23, 0.2);
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

.titles span:nth-child(1),
.markers-row span:nth-child(1) {
  text-align: left;
}

.titles span:nth-child(2),
.markers-row span:nth-child(2) {
  text-align: right;
}

.markers-row {
  display: grid;
  width: 80%;
  align-self: center;
  margin-top: 20px;
  font-size: medium;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--user-pc-color, rgb(255, 180, 94));
}

.stop-markers {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.stop-markers.light {
  scrollbar-color: rgba(107, 107, 107, 0.2) transparent;
}

@media (max-height: 724px) {
  .stopwatch-content {
    margin-top: 20rem;
  }
}
@media (max-height: 512px) {
  .stopwatch-content {
    margin-top: 12rem;
  }
}
</style>
