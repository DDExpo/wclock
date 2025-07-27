<script lang="ts">
  import { userSettings } from "$lib/stores/focusState.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import TopRightButton from "../TopRightButton.svelte";

  let isValidTime: boolean = $state(false)

  function startSesion() {
    isValidTime = !isValidTime
  }

</script>

<div class={["focus-comp", { light: appTheme.light }]}>
  <div class="header">
      <div class="name">Focus</div>
      <div class="top-buttons">
        <TopRightButton onClick={ () => {} } icon="icons/buttons/arrow-up-right-from-square.svg" alt="settings"  --end=16px/>
        <TopRightButton onClick={ () => {} } icon="icons/focus/dots.svg" alt="settings" --end=16px/>
    </div>
  </div>
  <div class="focus-body">
    <div class="focus-title">Ready, set, focus!</div>
    <div class="focus-subtitle">
      Achieve your goals and get more done with focus sessions. Tell us how much time you have, and we’ll set up the rest.
    </div>
    <div class={["focus-timer", { valid: isValidTime }]}>
      <input type="text" bind:value={userSettings.time} class="focus-input" />
      <div class="mins" style:margin-top=-10px>mins</div>
    </div>
    <div class="focus-options">
      <input type="checkbox" bind:checked={userSettings.skip}/>
      <span>Skip breaks</span>
    </div>
    <button class="start-button" onclick={ startSesion }>Start focus session</button>
  </div>
</div>
<style>

.focus-comp {
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 200px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  background: rgb(21, 21, 20);
  user-select: none;
  overflow-y: scroll;
  scrollbar-width: none;
}

.focus-comp.light {
  background: rgb(247, 179, 111);
}
.focus-comp.light .focus-title {
  color: #2b2b2b;
}
.focus-comp.light .focus-subtitle {
  color: #555;
}
.focus-comp.light .focus-timer {
  background: rgba(255, 250, 244, 0.664);
  border-radius:15px;
  box-shadow: 0px 3px 1px rgba(16, 16, 16, 0.2);
  color: #000000;
}

.focus-comp.light .focus-timer.valid {
  background: rgba(255, 20, 20, 0.504);
}

.focus-comp.light .focus-timer input{
  font-size: 2.45rem;
  margin-bottom: 5px;
}
.focus-comp.light .focus-input {
  color: #333;
}
.focus-comp.light .focus-options {
  color: #555;
}
.focus-comp.light .focus-options input {
  accent-color: rgb(193, 232, 233);
}
.focus-comp.light .start-button {
  font-family: serif;
  border-radius: 12px;
  background: rgba(210, 228, 247, 0.513);
  box-shadow: 0px 2px 0px rgb(0, 0, 0, 0.3);
  color: #030303eb;
}

.header {
  display: flex;
  position: relative;
  width: 100;
  padding: 0.7rem;
  align-items: center;
  justify-content: space-between;
}

.name {
  display: flex;
}

.top-buttons {
  display: flex;
  width: 100%;
  justify-content: end;
}

.focus-body {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  gap: 5px;
  align-items: center;
}

.focus-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f2f2f2;
  letter-spacing: 0.01em;
  text-align: center;
}

.focus-subtitle {
  font-size: 0.85rem;
  width: 80%;
  text-align: center;
  color: #c3c3c3;
  line-height: 1.5;
  opacity: 0.85;
}

.focus-timer {
  display: flex;
  align-items: center;
  width: 100px;
  height: 70px;
  padding-bottom: 15px;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: white;
  background: #202020;
  box-shadow: 0px 2px 0px rgb(255, 255, 255);
  flex-direction: column;
}

.focus-timer.valid {
  background: rgba(213, 56, 56, 0.573);
}

.focus-timer input {
  font-size: 3rem;
}

.focus-input {
  all: unset;
  background: transparent;
  width: 60px;
  color: #eee;
  font-size: 2rem;
  text-align: center;
  padding: 0.5rem;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.focus-options {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #c3c3c3;
  gap: 10px;
  margin-bottom: 10px;
}

.focus-options input {
  accent-color: #f3cb17;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.start-button {
  background: transparent;
  color: #eee;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  font-family: dark-theme-font;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0px 1.5px 0px rgba(164, 237, 238, 1);
  cursor: pointer;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 0px rgba(164, 237, 238, 1);
}

.focus-comp.light .start-button:hover {
  box-shadow: 0px 6px 0px rgba(255, 253, 249, 0.648);
}

.start-button:active {
  transform: translateY(0);
  box-shadow: 0px 6px 0px rgb(236, 195, 35);
}

.focus-comp.light .start-button:active {
  transform: translateY(0px);
  box-shadow: 0px 6px 0px rgba(141, 254, 252, 0.93);
}
</style>