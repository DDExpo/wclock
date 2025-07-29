<script lang="ts">
  import { appSettings } from "$lib/stores/utils.svelte";



</script>


<div class={["pass-comp", {light: appSettings.Theme}]}>
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