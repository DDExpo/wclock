<script lang="ts">
  import { CheckWindowSize, GetWindowsPcColors, SetWindowAlwaysOnTop } from '$lib/wailsjs/go/main/App';
  import { isAlwaysOnTop, appTheme } from '../stores/sideBarAndTheme.svelte'
  
  let isSidebarOpen: boolean = $state(false);
  let appWindowSizeEnough: boolean = $state(false)

  async function toggleTheme() {
    appTheme.isLight = !appTheme.isLight;
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    if (["#eee", "#242323d6"].includes(appTheme.windowsColor)) { appTheme.windowsColor = appTheme.isLight ? "#eee": "#242323d6"};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);
  }

  async function checkWindowSizeEnough() {
    isSidebarOpen = true
    const size = await CheckWindowSize()
    if (size) {appWindowSizeEnough = true} else {appWindowSizeEnough = false}
  }

  function setAlwaysOnTop() {
    if (!isAlwaysOnTop.onTop) {
      SetWindowAlwaysOnTop(true);
      isAlwaysOnTop.onTop = true;
    } else {
      SetWindowAlwaysOnTop(false);
      isAlwaysOnTop.onTop = false;
    };
  };

</script>

<main style="display: flex">
  <div class="sidebar" class:open={isSidebarOpen && appWindowSizeEnough} class:light={appTheme.isLight}
  onmouseenter={checkWindowSizeEnough} onmouseleave={() => (isSidebarOpen = false)}
  role="region">
  <ul>
    <li>
      <a href="/focus">
        <button class="icon-btn" class:light={appTheme.isLight}>
          <span class="dot"></span>
          <img src="icons/sidebar/time-quarter-past.svg" alt="Focus menu"/>
          <span class="item-text">Focus</span>
        </button>
      </a>
    </li>
    <li>
      <a href="/stopwatch">
        <button class="icon-btn" class:light={appTheme.isLight}>
          <span class="dot"></span>
          <img src="icons/sidebar/time-fast.svg" alt="Stopwatch menu"/>
          <span class="item-text">Stopwatch</span>
        </button>
      </a>  
    </li>
    <li>
      <a href="/timer">
        <button class="icon-btn" class:light={appTheme.isLight}>
          <span class="dot"></span>
          <img src="icons/sidebar/hourglass-end.svg" alt="Timers menu"/>
          <span class="item-text">Timer</span>
        </button>
      </a>
    </li>
    <li>
      <a href="/alarm">
        <button class="icon-btn" class:light={appTheme.isLight}>
          <span class="dot"></span>
          <img src="icons/sidebar/alarm-exclamation.svg" alt="Alarm menu"/>
          <span class="item-text">Alarm</span>
        </button>
      </a>
    </li>
  </ul>
  <div class="util-buttons" class:light={appTheme.isLight} >
    <a href="/settings">
      <button class="icon-btn-settings" class:light={appTheme.isLight}>
        <img src="icons/sidebar/settings.svg" alt="Settings menu"/>
      </button>
    </a>
    <button class="icon-btn-utils-dot">
      <img src="/icons/sidebar/dot.svg" alt="dot">
    </button>
    <button class="icon-btn-toggle-theme" onclick={toggleTheme}>
      <img src="/icons/sidebar/moon.svg" alt="Dark light mode">
    </button>
    <button class="icon-btn-toggle-always-ontop" class:light={appTheme.isLight} onclick={setAlwaysOnTop}>
      {#if !isAlwaysOnTop.onTop}
        <img src="icons/sidebar/lock-open.svg" alt="AlwaysOnTop"/>
      { :else }
        <img src="icons/sidebar/lock-close.svg" alt="AlwaysOnTop"/>
      { /if }
    </button>
  </div>
  </div>
</main>

<style>

.sidebar {
  position: absolute;
  display: flex;
  background: #1a1a1a;
  width: 60px;
  height: 100vh;
  padding-top: 20px;
  overflow: hidden;
  transition: width 0.3s ease;
}
.sidebar.light {
  background: #fff4e9;
}

.sidebar a {
  all: unset;
}
.sidebar.open {
  width: 170px;
}

.sidebar span.item-text{
  display: none;
  font-family: dark-theme-font;
}
.sidebar.open span.item-text{
  display: flex;
}

.sidebar.sidebar.light span.item-text{
  font-family: serif;
}

.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0px;
  padding-top: 10px;
}

.icon-btn {
  display: flex;
  position: relative;
  align-items: center;
  width: 100vh;
  gap: 12px;
  padding: 12px 20px 12px 20px;
  border: none;
  background: transparent;
  color: #eee;
  cursor: pointer;
}
.icon-btn:hover {
  background: #595857;
}
.icon-btn.light:hover {
  background: #E8EEFF;
}

.icon-btn .dot {
  position: absolute;
  left: -1px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  width: 8px;
  height: 17px;
  border-radius: 15%;
  opacity: 0;
  background: var(--user-pc-color);
  transition: opacity 0.3s ease, transform 0.4s ease;
}
.icon-btn.light .dot {
  background: var(--user-pc-color);
}
.icon-btn:hover .dot {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.icon-btn img{
  width: 23px;
  filter: invert(90);
}
.icon-btn.light img {
  filter: invert(10%) opacity(85%);
}
.icon-btn.light .item-text {
  color: #3B2F2F;
}

.util-buttons {
  position: absolute;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  padding: 1px;
  left: 16px;
  bottom: 32px;
}
.util-buttons button {
  all: unset;
}

.util-buttons img {
  width: 12px;
  filter: invert(90%);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.util-buttons img:hover,
.util-buttons.light img:hover {
  transform: scale(1.7);
}

.util-buttons.light img {
  filter: invert(10%) opacity(85%);
}

</style>