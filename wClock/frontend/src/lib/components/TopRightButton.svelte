<script lang="ts">
  import { appSettings } from "$lib/stores/utils.svelte";

  let { icon, alt, onClick, compact=false} = $props()

</script>

<button class={["btn-top-right", { light: appSettings.Theme, compact: compact }]} onclick={ onClick }>
  <img src="{icon}" alt="{alt}"/>
</button>

<style> 

.btn-top-right {
  position: relative;
  display: block;
  left: var(--left, 0px);
  justify-self: end;
  margin-left: 1px;
  background: none;
  border: none;
  user-select: none;
  cursor: pointer;
}
.btn-top-right img {
  width: clamp(var(--start, 12px), var(--middle, 2.5vw), var(--end, 26px));
  filter:  invert(90%) opacity(30%);
  transition: transform 0.3s ease;
}
.btn-top-right img:hover {
  transform: scale(1.5);
}
.btn-top-right.light img {
  filter: invert(10%) opacity(30%);
}

.btn-top-right.compact img {
  transform: rotate(180deg);
}
.btn-top-right.compact img:hover {
  transform: scale(1.5);
  transform: rotate(180deg);
}

.btn-top-right.light.compact img:hover {
  transform: scale(1.5);
}

</style>