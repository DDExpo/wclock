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
    document.documentElement.style.setProperty('--user-color', $userWindowsPcColor);
  }

  async function checkWindowSizeEnough() {
    isSidebarOpen = true
    const size = await CheckWindowSize()
    console.log(appWindowSizeEnough, isSidebarOpen)
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
    <button class="icon-btn-toggle-theme" class:light={$isLightTheme} onclick={toggleTheme}>
      <img src="/icons/moon.svg" alt="toogle-dark-light-mode">
    </button>
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
  width: 175px;
}

.sidebar span.item-text{
  display: none;
}
.sidebar.open span.item-text{
  display: flex;
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
  background: #363636;
}
.icon-btn.light:hover {
  background: #e0965e;
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
  background: var(--user-color);
  transition: opacity 0.3s ease, transform 0.4s ease;
}
.icon-btn.light .dot {
  background: var(--user-color);
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

.icon-btn-toggle-theme {
  position: fixed;
  left: 13px;
  bottom: 7px;
  z-index: 100;
  background: transparent;
  border: none;
}

.icon-btn-toggle-theme img {
  width: 20px;
  filter: invert(90%);
  cursor: pointer;
  transition: width 0.2s ease;
}
.icon-btn-toggle-theme img:hover {
  width: 23px;
  
}

.icon-btn-toggle-theme.light img {
  filter: invert(10%) opacity(85%);
}
.icon-btn-toggle-theme.light img:hover {
  width: 23px;
}

</style>