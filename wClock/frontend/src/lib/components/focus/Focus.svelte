<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import TopRightButton from "../TopRightButton.svelte";



</script>


<div class={["focus-comp", {light: appTheme.light}]}>
  <div class="top-buttons">
    <TopRightButton onClick={ () => {} } icon="icons/buttons/arrow-up-right-from-square.svg" alt="settings" --end=16px/>
    <TopRightButton onClick={ () => {} } icon="icons/buttons/arrow-up-right-from-square.svg" alt="settings"  --end=16px/>
  </div>
</div>

<style>

.focus-comp {
  display: flex;
  min-width: 200px;
  min-height: 250px;
  width: 100%;
  height: 100%;
  background: rgb(33, 33, 33);
  border-radius: 0px;
}

.focus-comp.light {
  background: rgb(218, 159, 100);
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