<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
</script>
<div class="pa">
  <div class={["focus-page", {"light": appTheme.light}]}>
    <div class="grid-container">
      <div class="box">Focus</div>
      <div class="box">Tasks</div>
      <div class="box">Goal</div>
      <div class="box">Pass</div>
    </div>
  </div>
</div>

<style>

.pa {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.focus-page {
  display: flex;
  margin-left: 80px;
  margin-top: 35px;
  scrollbar-width: thick;
  overflow: auto;
  scrollbar-color: rgba(255, 255, 255, 0.05) transparent;
}

.grid-container {
  display: grid;
  width: 100vw;
  height: 100vh;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 35px;
  margin-right: 20px;
}

.box {
  width: 50vw;
  height: 50vh;
  background: wheat;
}

/* .focus-page {
  display: inline-block;
  height: 100vh;
  width: 100%;
  margin-left: 100px;
  margin-top: 35px;
  overflow: scroll;
}
.focus-page.light {
  scrollbar-color: rgba(107, 107, 107, 0.2) transparent;
}

.focus-page.light .box {
  border-radius: 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 10px;
}

.box {
  min-width: 300px;
  min-height: 250px;
  padding: 1rem;
  background-color: rgba(255, 217, 217, 1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
} */

</style>