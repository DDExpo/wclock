<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";

  let { icon, alt, onClick, compact=false} = $props()

</script>

<button class={["btn-top-right", { light: appTheme.light, compact: compact }]} onclick={ onClick }>
  <img src="{icon}" alt="{alt}"/>
</button>

<style> 

.btn-top-right {
  position: relative;
  display: block;
  left: var(--left, 0px);
  justify-self: end;
  background: none;
  border: none;
}
.btn-top-right img {
  width: clamp(var(--start, 12px), var(--middle, 2.5vw), var(--end, 26px));
  filter:  invert(90%) opacity(30%);
  cursor: pointer;
  transition: transform 0.3s ease;
}
.btn-top-right img:hover {
  transform: scale(1.5);
}
.btn-top-right.light img {
  filter: invert(10%) opacity(30%);
}
.btn-top-right.compact {
  left: 10px;
}
.btn-top-right.compact img {
  transform: rotate(180deg);
}
.btn-top-right.compact img:hover {
  transform: scale(1.5);
  transform: rotate(180deg);
}

</style>