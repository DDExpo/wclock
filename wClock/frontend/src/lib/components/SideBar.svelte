<script lang="ts">
  import { isAlwaysOnTop, appTheme } from '$lib/stores/sideBarAndTheme.svelte'
  import { CheckWindowSize, GetWindowsPcColors, SetWindowAlwaysOnTop } from '$lib/wailsjs/go/main/App';


  let isSidebarOpen: boolean = $state(false);
  let appWindowSizeEnough: boolean = $state(false)

  async function toggleTheme() {
    appTheme.light = !appTheme.light;
    const color = await GetWindowsPcColors()
    if (color) {appTheme.windowsColor = color};
    if (["#eee", "#242323d6"].includes(appTheme.windowsColor)) { appTheme.windowsColor = appTheme.light ? "#eee": "#242323d6"};
    document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);
    console.log(appTheme.light, isSidebarOpen, appWindowSizeEnough);
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

  function pass(){}

</script>

<main style="display: flex">
  <div class={["sidebar", { light: appTheme.light, open: isSidebarOpen && appWindowSizeEnough}]}
  onmouseenter={ checkWindowSizeEnough } onmouseleave={() => (isSidebarOpen = false)}
  role="region">
  <ul>
    {#snippet sidebarButton(link: string, img: string, alt: string, spanText: string)}
    <a href="{link}">
      <button class="icon-btn">
        <span class="dot"></span>
        <img src="{img}" alt="{alt}"/>
        <span class="item-text">{spanText}</span>
      </button>
    </a>
    {/snippet}

    <li>{@render sidebarButton('/focus', 'icons/sidebar/time-quarter-past.svg', 'Focus menu', 'Focus')}</li>
    <li>{@render sidebarButton('/stopwatch', 'icons/sidebar/time-fast.svg', 'Stopwatch menu', 'Stopwatch')}</li>
    <li>{@render sidebarButton('/timer', 'icons/sidebar/hourglass-end.svg', 'Timers menu', 'Timer')}</li>
    <li>{@render sidebarButton('/alarm', 'icons/sidebar/alarm-exclamation.svg', 'Alarm menu', 'Alarm')}</li>
  </ul>

  <div class={["util-buttons",{light: appTheme.light}]} >
    <a href="/settings"><button class="icon-btn-util"><img src="icons/sidebar/settings.svg" alt="Settings menu"/></button></a>
    <button class="icon-btn-util" onclick={ pass }><img src="/icons/sidebar/dot.svg" alt="dot"></button>
    <button class="icon-btn-util" onclick={ toggleTheme }><img src="/icons/sidebar/moon.svg" alt="Theme"></button>
    <button class="icon-btn-util" onclick={ setAlwaysOnTop }>
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
  z-index: 100;
}
.sidebar ul {
  list-style: none;
  margin: 0;
  padding: 0px;
  padding-top: 10px;
}
.sidebar a {
  all: unset;
}
.sidebar.open {
  width: 170px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.7);
}
.sidebar span.item-text{
  opacity: 0%;
  transition: opacity 0.3s ease 0.3s;
}
.sidebar.open span.item-text{
  opacity: 100%;
}
.sidebar.light {
  background: #fff4e9;
}

.sidebar.open.light {
  box-shadow: 0 6px 12px rgba(23, 23, 23, 0.5);
}

.sidebar.light .dot {
  background: var(--user-pc-color);
}
.sidebar.light .icon-btn:hover {
  background: #EBE8F2;
}
.sidebar.light .icon-btn img {
  filter: invert(10%) opacity(85%);
}
.sidebar.light .icon-btn .item-text {
  font-family: serif;
  color: #3B2F2F;
}

.icon-btn {
  display: flex;
  position: relative;
  align-items: center;
  font-family: dark-theme-font;
  width: 100vh;
  gap: 12px;
  padding: 12px 20px 12px 20px;
  border: none;
  background: transparent;
  color: #eee;
  cursor: pointer;
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
.icon-btn:hover {
  background: #595857;
}
.icon-btn:hover .dot {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}
.icon-btn img{
  width: 23px;
  filter: invert(90);
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
}
.util-buttons img:hover,
.util-buttons.light img:hover {
  transition: transform 0.3s ease;
  transform: scale(1.7);
}
.util-buttons.light img {
  filter: invert(10%) opacity(85%);
}

</style>