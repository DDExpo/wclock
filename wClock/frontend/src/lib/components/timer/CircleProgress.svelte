<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte"
  import type { PropsCircleProgress } from "$lib/types/StoreComponentsTypes";

  let { progress, cardTime }: PropsCircleProgress = $props();

  const radius = 60;
  const stroke = 12;
  const circumference = 2 * Math.PI * radius;

  let offset = $derived(circumference * (1 - ($progress!)));

</script>

<svg
  role="progressbar"
  aria-valuenow={$progress}
  aria-valuemin="0"
  aria-valuemax="100"
  viewBox={`0 0 ${radius * 2 + stroke} ${radius * 2 + stroke}`}
  class="circle-progress"
>
  <circle
    class={["bg", {light: appTheme.light }]}
    cx={radius + stroke / 2}
    cy={radius + stroke / 2}
    r={radius}
    stroke-width={stroke}
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
  >{$cardTime[0]}{$cardTime[1]}:{$cardTime[2]}{$cardTime[3]}:{$cardTime[4]}{$cardTime[5]}</text>

</svg>

<style>

.circle-progress {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bg {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.112);
}

.bg.light {
  stroke: #23232319;
}

.fg {
  fill: none;
  stroke: var(--user-pc-color, rgb(253, 154, 61));
  stroke-linecap: round;
}
.fg.light {
  stroke: var(--user-pc-color, rgb(119, 197, 245));
  stroke-opacity: 100%;
}

.progress-label {
  fill: #eee;
  font-size: clamp(25px, 4vw, 28px);
  font-family: dark-theme-font;
  word-break: break-all;
}

.progress-label.light {
  fill: #3B2F2F;
  font-family: serif;
}

</style>
