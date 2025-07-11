<script lang="ts">

  let milliseconds = $state(0);
  let seconds = $derived(Math.floor(milliseconds/1000));
  let minutes = $derived(Math.floor(seconds/60));
  let hours = $derived(Math.floor(minutes/60));

  let isRunning: boolean = $state(false)

  function startStopWatch() {
    if (!isRunning) {
      isRunning = true
      setInterval(() => {milliseconds += 10}, 11.7)
    } else {
      isRunning = false
    }
  }

  function endWatch(){

  }

  function resetWatch(){

  }

</script>

<div class="stopwatch-page">
  <div class="stopwatch">
    {hours}h {minutes}m {seconds}s {milliseconds}ms
    <button onclick={startStopWatch}>
      startStop
    </button>
    <button onclick={endWatch}>
      end
    </button>
      <button onclick={resetWatch}>
      reset
    </button>
  </div>
</div>

<style>

.stopwatch-page {
  position: fixed;
  display: flex;
  left: 120px;
  top: 60px;
}

.stopwatch {
  color: #eee;
}

</style>
