<script lang="ts">
  import CircleButton from "../CircleButton.svelte";
  import CircleProgress from './CircleProgress.svelte';
  import TopRightButton from "../TopRightButton.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { cards, type Timer } from "$lib/stores/timerWatch.svelte";
  
  let value = $state(0.1);

  function startStopWatch(running: boolean, timer: Timer) {
    if (!running) {
      running = true;
      timer.start();
    } else {
      running = false; 
      timer.stop();
    };
  };

</script>

<div class="card-grid">
  {#each cards as card (card.id)}
  <div class={["card", { light: appTheme.light }]}>
    <div class="card-header">
      <div class="card-name">{card.name}</div>
      <div class="top-buttons">
        {#if !card.compact}
          <TopRightButton onClick={() => {}} icon="icons/buttons/edit.svg" alt="edit" --end=16px/>
        {/if}
        <TopRightButton onClick={() => {}} icon="icons/buttons/arrow-up-right-from-square.svg" alt="Compact mode" --end=16px/>
      </div>
    </div>
    <div class="circle-progress-bar">
      <CircleProgress progress={value} />
    </div>
    <div class="bottom-buttons">
      <CircleButton
        onClick={ () => startStopWatch(card.running, card.timer) }
        icon={card.running ? "icons/buttons/pause.svg" : "icons/buttons/play.svg"}
        alt={card.running ? "pause" : "start"} />
      <CircleButton onClick={ card.timer.stop } icon="icons/buttons/reset.svg" alt="reset" />
      </div>
    </div>
    {/each}
  </div>
<input type="range" min="0" max="1" step="0.01" bind:value />

<style>

.card-grid {
  display: flex;
  height: fit-content;
  width: fit-content;
  flex-wrap: wrap;
  gap: 1.5vh 1.5vw;
  padding-left: clamp(100px, 25vw, 140px);
  padding-top: 40px;
  padding-bottom: 40px;
  padding-right: 25px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;;
  background: #373737;
  box-shadow: -4px 8px 8px rgba(23, 23, 23, 0.5);
  box-sizing: border-box;
  padding: 1rem;
  width: clamp(180px, 30vw, 260px);
  height: clamp(240px, 30vh, 60vh, 360px);
  font-family: dark-theme-font;
  gap: 1rem;
  border-radius: 3px;
  position: relative;
}

.card.light {
  background: #FFA44A;
  border-radius: 1rem;
  box-shadow: -4px 8px 8px rgba(97, 97, 97, 0.2);
  font-family: serif;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
  margin-left: -5px;
}

.card-name {
  font-size: clamp(14px, 2vw, 22px);
  font-weight: bold;
  color: #ffffff;
  word-break: break-all;
}

.top-buttons {
  display: flex;
  margin-right: -14px;
}

.circle-progress-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: clamp(120px, 25vw, 200px);
  flex-shrink: 0;
}

.bottom-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  flex-shrink: 1;
  max-height: 70px;
  margin-bottom: 0.5rem;
}

</style>