<script lang="ts">
  import type { PropsCard } from "$lib/types/StoreComponentsTypes";
  
  import AddForm from "../AddForm.svelte";
  import CircleButton from "../CircleButton.svelte";
  import CircleProgress from './CircleProgress.svelte';
  import TopRightButton from "../TopRightButton.svelte";

  import { deleteCard, notDraggable } from "$lib/stores/timerWatch.svelte";
  import { appSettings, makeMiniWindow } from "$lib/stores/utils.svelte";
  
  let { card, cardInd }: PropsCard = $props()
  let showCardForm: boolean = $state(false)
  let cardStateCompact: boolean = $state(false)

  function makeWindowCompact() {
    cardStateCompact = !cardStateCompact
    makeMiniWindow(cardStateCompact)
  }
  
  function hideShowCardForm() {
    showCardForm = !showCardForm
    notDraggable.dragg = showCardForm
    resetTimer()
  }

  function startStopWatch() {
    if (!card.running) {card.timer.start();
    } else {card.timer.stop();};
    card.running = !card.running;
  };

  function resetTimer() {
    card.running = false
    card.timer.reset()
  }

</script>

<div class={["card", { light: appSettings.Theme, "compact": cardStateCompact}]}>
  <div class="card-header">
    <div class="card-name">{card.name}</div>
    <div class="top-buttons">
      <TopRightButton onClick={ makeWindowCompact } icon="icons/buttons/arrow-up-right-from-square.svg" alt="Compact mode" compact={cardStateCompact} --end=16px/>
      {#if !cardStateCompact}
        <TopRightButton onClick={ hideShowCardForm } icon="icons/buttons/edit.svg" alt="edit" --end=16px/>
          {#if showCardForm }
            <AddForm closeForm={ hideShowCardForm } formName="Save Timer" Text={card.name} Dial={[...card.initialTime]} change={true} ind={cardInd}/>
          {/if}
          <TopRightButton onClick={() => { deleteCard(cardInd, card.id) }} icon="icons/buttons/trash.svg" alt="delete" --end=16px/>
      {/if}
    </div>
  </div>
  <div class="circle-progress-bar">
    <CircleProgress progress={card.timeLeft} time={card.time}/>
  </div>
  <div class="bottom-buttons">
    <CircleButton
      onClick={ startStopWatch }
      icon={card.running ? "icons/buttons/pause.svg" : "icons/buttons/play.svg"}
      alt={card.running ? "pause" : "start"}
      isRunning={card.running} />
    <CircleButton onClick={ resetTimer } icon="icons/buttons/reset.svg" alt="reset" />
  </div>
</div>

<style>

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;;
  background: #373737;
  box-shadow: -4px 8px 8px rgba(23, 23, 23, 0.5);
  box-sizing: border-box;
  padding: 1rem;
  width: clamp(180px, 30vw, 260px);
  height: clamp(250px, 45vw, 380px);
  font-family: dark-theme-font;
  gap: 1rem;
  border-radius: 3px;
  position: relative;
}

.card.compact {
  position: absolute;
  background: #373737;
  width: 200px;
  height: 180px;
  z-index: 10;
  top: 0px;
  left: 0px;
  border-radius: 0;
  padding: 10px;
}

.card.compact.light {
  background: #ecc3c3;
  border-radius: 0;
}

.card.compact .card-header {
  margin-top: 25px;
}

.card.compact .card-name {
  margin-left: 5px;
  z-index: 11;
  font-size: 12px;
  max-width: 55px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card.compact .top-buttons {
  z-index: 10;
  margin-right: -5px;
}

.card.compact .circle-progress-bar {
  top: -30px;
  height: 130px;
}

.card.compact .bottom-buttons {
  position: absolute;
  z-index: 11;
  top: 147px;
  left: 6px;
  gap: 120px;
}

.card.light {
  background: #DAAFAF;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  height: clamp(140px, 25vw, 220px);
  flex-shrink: 0;
}

.bottom-buttons {
  height: 100%;
  display: flex;
  justify-content: center;
  gap: clamp(30px, 2.5vw, 40px);
  margin-top: -10px;
}

</style>