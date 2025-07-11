<script lang="ts">
  import { CheckWindowSize, GetWindowsPcColors } from '$lib/wailsjs/go/main/App';
  import { isLightTheme } from '../stores/themes'
  import { userWindowsPcColor } from '../stores/themes';

  let isSidebarOpen: boolean = $state(false);
  let appWindowSizeEnough: boolean = $state(false)

  async function toggleTheme() {
    isLightTheme.update(t => !t);
    const color = await GetWindowsPcColors()
    if (color) {userWindowsPcColor.set(color)};
    if (["#eee", "#242323d6"].includes($userWindowsPcColor)) { userWindowsPcColor.update(t => t = isLightTheme ? "#eee": "#242323d6")};
    document.documentElement.style.setProperty('--user-pc-color', $userWindowsPcColor);
  }

  async function checkWindowSizeEnough() {
    isSidebarOpen = true
    const size = await CheckWindowSize()
    if (size) {appWindowSizeEnough = true} else {appWindowSizeEnough = false}
  }

</script>

<main style="display: flex">
  <div class="sidebar" class:open={isSidebarOpen && appWindowSizeEnough} class:light={$isLightTheme}
  onmouseenter={checkWindowSizeEnough} onmouseleave={() => (isSidebarOpen = false)}
  role="region">
  <ul>
    <li>
      <a href="/focus">
        <button class="icon-btn" class:light={$isLightTheme}>
          <span class="dot"></span>
          <img src="icons/sidebar/time-quarter-past.svg" alt="Focus menu"/>
          <span class="item-text">Focus</span>
        </button>
      </a>
    </li>
    <li>
      <a href="/stopwatch">
        <button class="icon-btn" class:light={$isLightTheme}>
          <span class="dot"></span>
          <img src="icons/sidebar/time-fast.svg" alt="Stopwatch menu"/>
          <span class="item-text">Stopwatch</span>
        </button>
      </a>  
    </li>
    <li>
      <a href="/timer">
        <button class="icon-btn" class:light={$isLightTheme}>
          <span class="dot"></span>
          <img src="icons/sidebar/hourglass-end.svg" alt="Timers menu"/>
          <span class="item-text">Timer</span>
        </button>
      </a>
    </li>
    <li>
      <a href="/alarm">
        <button class="icon-btn" class:light={$isLightTheme}>
          <span class="dot"></span>
          <img src="icons/sidebar/alarm-exclamation.svg" alt="Alarm menu"/>
          <span class="item-text">Alarm</span>
        </button>
      </a>
    </li>
  </ul>
  <div class="util-buttons" class:light={$isLightTheme} >
    <button class="icon-btn-toggle-theme" onclick={toggleTheme}>
      <img src="/icons/moon.svg" alt="toogle-dark-light-mode">
    </button>
    <a href="/settings">
      <button class="icon-btn-settings" class:light={$isLightTheme}>
        <img src="icons/sidebar/settings.svg" alt="Settings menu"/>
      </button>
    </a>
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
  left: 16px;
  bottom: 32px;
}

.util-buttons button {
  all: unset
}

.util-buttons img {
  width: 12px;
  filter: invert(90%);
  cursor: pointer;
  transition: width 0.2s ease;
}
.util-buttons img:hover {
  width: 20px;
}

.util-buttons.light img {
  filter: invert(10%) opacity(85%);
}
.util-buttons.light img:hover {
  width: 20px;
}

</style>