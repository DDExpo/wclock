<script lang="ts">
  import type { Timer, PropsCard } from "$lib/types/StoreComponentsTypes";

  import AddForm from "./AddForm.svelte";
  import CircleButton from "../CircleButton.svelte";
  import CircleProgress from './CircleProgress.svelte';
  import TopRightButton from "../TopRightButton.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { deleteCard } from "$lib/stores/timerWatch.svelte";
  import type { CardType } from "$lib/types/StoreComponentsTypes";
  
  let { card, ind }: PropsCard = $props()
  let showCardForm: boolean = $state(false)

  function hideShowCardForm() {
    showCardForm = !showCardForm
  }

  function startStopWatch(card: CardType) {
    if (!card.running) {
      card.running = true;
      card.timer.start();
    } else {
      card.running = false; 
      card.timer.stop();
    };
  };

  function resetTimer(card: CardType) {
    card.running = false
    card.timer.reset()
  }

</script>

<div class={["card", { light: appTheme.light }]}>
  <div class="card-header">
    <div class="card-name">{card.name}</div>
    <div class="top-buttons">
      <TopRightButton onClick={ hideShowCardForm } icon="icons/buttons/edit.svg" alt="edit" --end=16px/>
      <div draggable="true" role="form" ondragstart={(e) => { e.preventDefault(); e.stopPropagation();}}>
        {#if showCardForm }
        <AddForm closeForm={ hideShowCardForm } formName="Save" cardName={card.name} cardDial={card.initialTime} change={true} cardInd={ind}/>
        {/if}
      </div>  
      <TopRightButton onClick={() => {}} icon="icons/buttons/arrow-up-right-from-square.svg" alt="Compact mode" --end=16px/>
      <TopRightButton onClick={() => { deleteCard(card.id) }} icon="icons/topbar/cross.svg" alt="delete" --end=16px/>
    </div>
  </div>
  <div class="circle-progress-bar">
    <CircleProgress progress={card.timeLeft} cardTime={card.time}/>
  </div>
  <div class="bottom-buttons">
    <CircleButton
      onClick={ () => startStopWatch(card) }
      icon={card.running ? "icons/buttons/pause.svg" : "icons/buttons/play.svg"}
      alt={card.running ? "pause" : "start"} />
    <CircleButton onClick={ () => { resetTimer(card) }} icon="icons/buttons/reset.svg" alt="reset" />
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
  margin-top: 0.5rem;
}

</style>