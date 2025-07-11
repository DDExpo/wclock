import { writable } from "svelte/store";

export const isLightTheme = writable<boolean>(false);
export const userWindowsPcColor = writable<string>("#eee");
