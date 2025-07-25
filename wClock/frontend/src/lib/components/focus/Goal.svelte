<script lang="ts">
    import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
    import TopRightButton from "../TopRightButton.svelte";



</script>


<div class={["goal-comp", {light: appTheme.light}]}>
  <div class="top-buttons">
    <TopRightButton onClick={ () => {} } icon="icons/buttons/arrow-up-right-from-square.svg" alt="settings" --end=16px/>
  </div>
</div>

<style>

.goal-comp {
  display: flex;
  min-width: 200px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  background: rgb(33, 33, 33);
  border-radius: 0px;
}

.goal-comp.light {
  background: wheat;
}

.top-buttons {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: start;
  justify-content: end;
  padding: 0.5rem;
}
</style>