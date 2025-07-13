<script lang="ts">
  import Card from "$lib/components/timer/Card.svelte";
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { cards, createCard } from "$lib/stores/timerWatch.svelte";
</script>

<div class={["timer-page", { light: appTheme.light }]}>
  <Card />
  <button class="add-btn" onclick={ createCard }><img src="icons/buttons/add.svg" alt="add"/></button>
</div>

<style>

.timer-page {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.timer-page.light {
  scrollbar-color: rgba(107, 107, 107, 0.2) transparent;
}

.timer-page.light .add-btn img {
  filter: invert(10%) opacity(80%);
}

.add-btn {
  position: absolute;
  background: none;
  border: none;
  bottom: 12px;
  right: 3px;
}
.add-btn img {
  width: 20px;
  filter:  invert(90%) opacity(90%);
  cursor: pointer;
}
.add-btn img:hover,
.timer-page.light .add-btn img:hover {
  transition: transform 0.3s ease;
  transform: scale(1.5);
}

</style>
