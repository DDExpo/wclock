<script lang="ts">
  import { onDestroy, onMount } from 'svelte';

  import { appSettings } from '$lib/stores/utils.svelte';

  let posX = $state(Math.round(window.innerWidth / 2));
  let posY = $state(Math.round(window.innerHeight / 2));
  let velY = $state(-180);
  let velX = $state(240);
  
  let last = 0;
  let textColor = $state("");
  let clickCount = $state(0);
  let idAnimation = 0
  let shadowColor = $state("");
  let startAnimation = $state(false);

  function clampPosition() {
    posX = Math.min(Math.max(posX, 100), window.innerWidth - 100);
    posY = Math.min(Math.max(posY, 100), window.innerHeight - 100);
  }

  function centerPosition() {
    posX = Math.round(window.innerWidth / 2);
    posY = Math.round(window.innerHeight / 2);
  }

  function randomColor() {
    const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    shadowColor = color;
    textColor = color;
  }

  function loop(now: number) {
    if (!last) last = now;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    posX += velX * dt;
    posY += velY * dt;

    if (posX - 100 <= 0) {
      posX = 100;
      velX = Math.abs(velX);
      onCollision();
    } else if (posX + 100 >= window.innerWidth) {
      posX = window.innerWidth - 100;
      velX = -Math.abs(velX);
      onCollision();
    }

    if (posY - 100 <= 0) {
      posY = 100;
      velY = Math.abs(velY);
      onCollision();
    } else if (posY + 100 >= window.innerHeight) {
      posY = window.innerHeight - 100;
      velY = -Math.abs(velY);
      onCollision();
    }
    idAnimation = requestAnimationFrame(loop)
  }

  function onCollision() {
    randomColor();
  }

  function handleClick() {
    clickCount += 1;
    if (clickCount === 42) { idAnimation = requestAnimationFrame(loop); startAnimation = true; }
  }

  function handleResize() {
    if (!startAnimation) {
      centerPosition();
    } else {
      clampPosition();
    }
  }

  onDestroy(() => {
    cancelAnimationFrame(idAnimation)
  });

  onMount(() => {
    window.addEventListener('resize', handleResize);
  });

</script>

<div class="wrapper">
  <div class="w-screen h-screen bg-[#111] relative overflow-hidden">
    <button class={["button-card", {light: appSettings.Theme }]} onclick={ handleClick } aria-pressed={ startAnimation } 
            style="left: {posX - 200 / 2}px; top: {posY - 200 / 2}px; width: 200px; height: 200px; box-shadow: 0 8px 24px {shadowColor}; color: {textColor}; position: absolute;">
      <h1>WClock</h1>
      <span>Your lovely offline clock</span>
    </button>
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    margin-left: 30px;
    position: relative;
    align-content: center;
    justify-content: center;
  }

  .button-card {
    all: unset;
    color: #eee;
    cursor: pointer;
    transform: translate(0, 0);
    text-align: center;
    background: rgba(0, 0, 0, 0.208);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.181);
    border-radius: 1rem;
  }
  .button-card.light {
    background: rgba(0, 0, 0, 0.255);
  }
  .button-card:hover,
  .button-card.light:hover {
    transform: translateY(-10px);
  }
  .button-card:active,
  .button-card.light:active {
    transform: scale(0.97);
  }

</style>