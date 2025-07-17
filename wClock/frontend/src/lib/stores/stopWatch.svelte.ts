import { writable } from "svelte/store";

export const markers = writable<string[]>([]);
export const stopWatchState = $state({
  running: false,
});

const createStopwatch = () => {
  const { subscribe, set, update } = writable({ h: 0, h1: 0, m: 0, m1: 0, s: 0, s1: 0, ms1: 0, ms: 0});

  let idInterval: number;
  
  function start() {

    let prev = performance.now();
    idInterval = setInterval(() => {
      const now = performance.now();
      const delta = now - prev;
      prev = now

      update(t => {
        const ms = Math.floor(t.ms + delta);

        const totalSeconds = Math.floor(ms / 1000);
        const ms1 = ms % 100;

        const s = totalSeconds % 10;
        const s1 = Math.floor((totalSeconds % 60) / 10);

        const totalMinutes = Math.floor(totalSeconds / 60);
        const m = totalMinutes % 10;
        const m1 = Math.floor((totalMinutes % 60) / 10);

        const totalHours = Math.floor(totalMinutes / 60);
        const h = totalHours % 10;
        const h1 = Math.floor(totalHours / 10);

        return {h, h1, m, m1, s, s1, ms1, ms}});
      }, 100);
  };

  function stop() {
    clearInterval(idInterval);
  }
  function cleanDial() {
    set({ h: 0, h1: 0, m: 0, m1: 0, s: 0, s1: 0, ms1: 0, ms: 0 });
  }
  function reset() {
    stop();
    set({ h: 0, h1: 0, m: 0, m1: 0, s: 0, s1: 0, ms1: 0, ms: 0 });
    markers.set([])
  }

  return {
    subscribe,
    start,
    stop,
    reset,
    cleanDial,
  };
};

export const stopWatch = createStopwatch();
