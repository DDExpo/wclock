<script lang="ts">
  import TopRightButton from "../TopRightButton.svelte";

  import { focusCardState } from "$lib/stores/focusState.svelte";
  import { appSettings, validateSettings } from "$lib/stores/utils.svelte";

  import { GiveNewSettings } from '$lib/wailsjs/go/main/App';

  let isNotValidTime: boolean = $state(false)

  function saveValidate() {
    isNotValidTime = validateSettings(false, true)
    if (!isNotValidTime) {GiveNewSettings({ Focus: appSettings.Focus.focus });}
  }

  function startSesion() {
    isNotValidTime = validateSettings(false, true)
    if (!isNotValidTime) {
      // 
    }
  }

</script>

<div class={["focus-comp", { light: appSettings.Theme, settings: focusCardState.isSettingsSide, session: focusCardState.sessionSide}]}>
  <div class="header">
    <div class="name">Focus</div>
    <div class="top-buttons">
      <TopRightButton onClick={ () => {} } icon="icons/buttons/arrow-up-right-from-square.svg" alt="settings"  --end=16px/>
      <TopRightButton onClick={ () => focusCardState.isSettingsSide = !focusCardState.isSettingsSide } icon="icons/focus/dots.svg" alt="settings" --end=16px/>
    </div>
  </div>

  <div class="flipper">
    <div class="focus-body">
      <div class="focus-title">Ready, set, focus</div>
      <div class="focus-subtitle">
        Achieve your goals and get more done with focus sessions.
      </div>
      <div class={["focus-timer", { valid: isNotValidTime }]}>
        <input type="text" bind:value={appSettings.Focus.focus.minutes} class="focus-input"  placeholder="0"/>
        <div class="mins" style:margin-top=-10px>mins</div>
      </div>
      <div class="focus-options">
        <input type="checkbox" bind:checked={appSettings.Focus.focus.skipBreaks} />
        <span>Skip breaks</span>
      </div>
      <button class="start-button" onclick={ startSesion }>Start focus session</button>
    </div>

    <div class={["focus-body-settings", { valid: isNotValidTime }]}>
      <div class="focus-settings">
        <div class="title">Settings</div>

        <div class="wrapper-input">
          <input class="daily-hours" type="text" bind:value={appSettings.Focus.focus.hours} placeholder="0"/>
          <span style:width=40% style:text-align=center>Hours</span>
        </div>
        <div class="wrapper-input">
          <div class="input-group">
            <label>
              <input class="daily-hours" type="text" bind:value={appSettings.Focus.focus.breaks} placeholder="0" />
              <span>Breaks</span>
            </label>
          </div>
          <div class="input-group">
            <label>
              <input class="daily-hours"type="text" bind:value={appSettings.Focus.focus.breaksTime} placeholder="0" />
              <span class="b">Breaks Time</span>
            </label>
          </div>
        </div>

        <div class="settings-buttons">
          <button class="save" onclick={ saveValidate }>
            <img src="icons/focus/disk.svg" alt="save icon" />
            Save
          </button>
          <button class="cancel" onclick={() => focusCardState.isSettingsSide = false }>
            Cancel
          </button>
        </div>
      </div>
    </div>
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
  perspective: 1000px;
}

.flipper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.focus-comp.settings .flipper {
  transform: rotateY(180deg);
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
  background-color: #faece3;
  box-shadow: 0px 3px 0px rgb(0, 0, 0, 0.3);
}
.focus-comp.light .focus-options input:checked {
  background-color: #6FD7F7;
}
.focus-comp.light .focus-options input:hover {
  box-shadow: 0px 3px 0px rgba(255, 253, 249, 0.648);
}

.focus-comp.light .focus-options input:active {
  transform: translateY(0px);
  box-shadow: 0px 3px 0px #6FD7F7;
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
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
  gap: 5px;
  margin-top: 10px;
  padding-bottom: 2rem;
  align-items: center;
  backface-visibility: hidden;
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
  box-shadow: 0px 3px 0px rgb(255, 255, 255);
  flex-direction: column;
}

.focus-timer.valid {
  background: rgba(255, 0, 0, 0.464);
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
  position: relative;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  color: #c3c3c3;
  gap: 10px;
  margin-bottom: 10px;
}

.focus-options input {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  cursor: pointer;
  background-color: #181818bd;
  box-shadow: 0px 3px 0px rgb(255, 255, 255);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.focus-options input:checked {
  background-color: #f3cb17;
}

.focus-options input:hover {
  transform: translateY(-2px);
  box-shadow: 0px 5px 0px rgb(255, 255, 255);
}

.focus-options input:active {
  transform: translateY(0px);
  box-shadow: 0px 3px 0px #6FD7F7;
}

.focus-options input[type="checkbox"]::after {
  content: '';
  position: absolute;
  margin-top: 2px;
  margin-left: 5px;
  width: 4px;
  height: 8px;
  border: solid rgba(0, 0, 0, 0.685);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  opacity: 0;
  pointer-events: none;
}

.focus-options input[type="checkbox"]:checked::after {
  opacity: 1;
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
  box-shadow: 0px 6px 0px #6FD7F7;
}

.focus-body-settings {
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

.focus-body-settings.valid input {
  background: rgba(200, 64, 64, 0.712);
}

.focus-comp.light .focus-body-settings.valid input {
  background: rgba(255, 0, 0, 0.509);
}

.focus-settings{
  display: flex;
  flex-direction: column;
  gap: 10px;
  width:100%;
  height:100%;
  justify-content: center;
  align-items: center;
  margin-top: -30px;
  overflow: hidden;
  container-type: inline-size;
}

.focus-settings .title {
  font-weight: bolder;
  font-size: clamp(5px, 8cqw, 30px);
  text-align: center;
  color: white;
}

.focus-comp.light .focus-settings .title {
  color: #151515d1;
}

.focus-comp.light .wrapper-input {
  border: 2px solid rgb(163, 120, 244);
  color: #3B2F2F;
  border-bottom: 4px solid rgb(163, 120, 244);
  font-size: clamp(10px, 5cqw, 40px);
}

.focus-comp.light .daily-hours {
  border-radius: 0.4em;
  background-color: rgba(255, 248, 233, 0.2);
  border: 1.5px solid rgba(163, 120, 244, 0.2)
}

.focus-comp.light .wrapper-input .b {
  margin-left: -2.5cqw;
}

.focus-comp.light .daily-hours:focus {
  background-color: rgba(255, 248, 233, 0.5);
  border-color: 1.5px solid rgba(163, 120, 244, 0.7a);
  outline: none;
}

.wrapper-input {
  display: flex;
  padding: 0.5rem 1rem;
  color: white;
  border: 2px solid rgba(164, 237, 238);
  border-bottom: 5px solid rgb(164, 237, 238);
  border-radius: 0.5rem;
  width:50%;
  font-size: clamp(10px, 5cqw, 40px);
  background: rgba(255, 255, 255, 0.02);
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  display: flex;
  flex-direction: column;
  gap: 0.1em;
  width: 100%;
}

.daily-hours {
  all: unset;
  display: flex;
  text-align: center;
  width: 30%;
  padding: 0.25em 0.5em;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(164, 237, 238, 0.3);
  transition: background 0.2s, border 0.2s;
  cursor: pointer;
}

.daily-hours:focus {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgb(164, 237, 238);
  outline: none;
}

.wrapper-input span {
  min-width: 6ch;
  align-content: center;
  text-align: start;
}

.settings-buttons {
  display: flex;
  justify-content: center;
}

.settings-buttons .save img {
  width: clamp(10px, 5cqw, 16px);
  height: clamp(10px, 5cqw, 16px);
  filter: invert(90);
}

.settings-buttons button {
  background: transparent;
  color: #eee;
  font-size: clamp(12px, 5cqw, 20px);
  font-weight: bold;
  font-family: dark-theme-font;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  box-shadow: 0px 3px 0px rgba(164, 237, 238, 1);
  cursor: pointer;
}
.focus-comp.light .settings-buttons button{
  font-family: serif;
  color: #1d1b1be2;
  box-shadow: 0px 3px 0px rgb(163, 120, 244);
}

.focus-comp.light .settings-buttons .save img {
  filter: invert(10%) opacity(85%);
}

.settings-buttons button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 0px rgba(164, 237, 238, 1);
}

.focus-comp.light .settings-buttons button:hover {
  box-shadow: 0px 6px 0px rgb(252, 235, 107);
}

.settings-buttons button:active {
  transform: translateY(0);
  box-shadow: 0px 6px 0px rgb(236, 195, 35);
}

.focus-comp.light .settings-buttons button:active {
  transform: translateY(0px);
  box-shadow: 0px 6px 0px #8edb88;
}

</style>