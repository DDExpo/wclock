
import { isAlwaysOnTop } from "$lib/stores/sideBarAndTheme.svelte";
import { MakeMiniWindowSize, SetWindowAlwaysOnTop } from "$lib/wailsjs/go/main/App";

export const watchState = $state({
  compact: false
}) 

export function makeMiniWindow(compact: boolean, width: number=200, height: number=180) {
  watchState.compact = compact;
  isAlwaysOnTop.onTop = compact;
  SetWindowAlwaysOnTop(compact);

  if (compact) {MakeMiniWindowSize(width, height, watchState.compact);  
  } else {MakeMiniWindowSize(356, 356, watchState.compact);};
};