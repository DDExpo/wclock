<script lang="ts">
  import type { dialTime, PropsCircleProgress } from "$lib/types/StoreComponentsTypes";

  import { writable } from "svelte/store";
  import { appSettings } from "$lib/stores/utils.svelte";

  let { progress, time=writable([0, 0, 0, 0, 0, 0] as dialTime), goal=0, focus=false }: PropsCircleProgress = $props();

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
  <defs>
    <filter id="depressed-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feOffset dx="1" dy="5" />
      <feGaussianBlur stdDeviation="7" result="offset-blur" />
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
      <feFlood flood-color="rgba(0, 0, 0, 0.7)" result="color" />
      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
      <feComposite operator="over" in="shadow" in2="SourceGraphic" />
    </filter>
  </defs>

  <g filter="url(#depressed-shadow)">
    <circle
      class={["bg", {light: appSettings.Theme}]}
      cx={radius + stroke / 2}
      cy={radius + stroke / 2}
      r={radius}
      stroke-width={stroke}
    />
    <circle
      class={["fg", {light: appSettings.Theme }]}
      cx={radius + stroke / 2}
      cy={radius + stroke / 2}
      r={radius}
      stroke-width={stroke}
      fill="none"
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      transform={`rotate(-90 ${radius + stroke / 2} ${radius + stroke / 2})`}
    />
  </g>
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    dominant-baseline="middle"
    textLength="80"
    lengthAdjust="spacingAndGlyphs"
    fill="#3B2F2F"
    style="text-shadow: 1px 1px 1px rgba(0,0,0,0.2), -1px -1px 1px rgba(255,255,255,0.2);"
    class={["progress-label", {light: appSettings.Theme }]}>
    {#if !focus}
      {$time[0]}{$time[1]}:{$time[2]}{$time[3]}:{$time[4]}{$time[5]}
    {:else if goal < 25}
      {Math.floor(goal)} hour
    {/if}
  </text>

</svg>

<style>

.circle-progress {
  position: absolute;
  width: 100%;
  height: 100%;
}

.bg {
  fill: rgba(0, 0, 0, 0.129);
  stroke: #707070;
}

.bg.light {
  fill: transparent;
  stroke: #ecc3c3;
}

.fg {
  fill: none;
  stroke: var(--user-pc-color, rgb(253, 154, 61));
  stroke-linecap: round;
  stroke-opacity: 100%;
}
.fg.light {
  stroke: var(--user-pc-color, rgb(119, 197, 245));
}

.progress-label {
  fill: #eee;
  font-size: 27px;
  font-family: dark-theme-font;
  word-break: break-all;
}

.progress-label.light {
  fill: #3B2F2F;
  color: #3B2F2F;
  font-family: serif;
}

</style>
