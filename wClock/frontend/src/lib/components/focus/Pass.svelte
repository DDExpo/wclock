<script lang="ts">
  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";



</script>


<div class={["pass-comp", {light: appTheme.light}]}>
</div>

<style>

.pass-comp {
  display: flex;
  min-width: 200px;
  min-height: 250px;
  background: rgb(33, 33, 33);
}

.pass-comp.light {
  background: wheat;
  border-radius: 15px;
}


</style>