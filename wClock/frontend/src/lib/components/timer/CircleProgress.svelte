<script>
    import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";

  let { progress=1 } = $props();
  
  const radius = 50;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = $derived(circumference * (1 - progress));
  
  document.documentElement.style.setProperty('--user-pc-color', appTheme.windowsColor);

</script>

<svg
  width={radius * 2 + stroke}
  height={radius * 2 + stroke}
  viewBox={`0 0 ${radius * 2 + stroke} ${radius * 2 + stroke}`}
  class="circle-progress"
>
  <circle
    class="bg"
    cx={radius + stroke / 2}
    cy={radius + stroke / 2}
    r={radius}
    stroke-width={stroke-1}
  />
  <circle
    class={["fg", {light: appTheme.light }]}
    cx={radius + stroke / 2}
    cy={radius + stroke / 2}
    r={radius}
    stroke-width={stroke}
    stroke-dasharray={circumference}
    stroke-dashoffset={offset}
    transform={`rotate(-90 ${radius + stroke / 2} ${radius + stroke / 2})`}
  />
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="middle"
    textLength="80"
    lengthAdjust="spacingAndGlyphs"
    class={["progress-label", {light: appTheme.light }]}
  >
  12:12:12
  </text>

</svg>

<style>

.circle-progress {
  position: absolute;
  z-index: 10;
  width: clamp(180px, 20vw, 200px);
  height: clamp(140px, 20vw, 200px);
}

.bg {
  fill: rgba(238, 238, 238, 0.3);
  stroke: #eee;
}

.fg {
  fill: none;
  stroke: var(--user-pc-color, #B83737);
  stroke-linecap: round;
}
.fg.light {
  stroke:#4AD4FF;
  stroke-opacity: 100%;
}

.progress-label {
  fill: #eee;
  font-size: clamp(25px, 4vw, 28px);
  text-shadow: -6px 8px 4px rgba(0, 0, 0, 0.5);
  font-family: dark-theme-font;
  word-break: break-all;
}

.progress-label.light {
  fill: #3B2F2F;
  font-family: serif;
  text-shadow: -3px 5px 1px rgba(0, 0, 0, 0.1);
}

</style>
