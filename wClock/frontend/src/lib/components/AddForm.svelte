<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  
  import type { dialTime, PropsForm } from "$lib/types/StoreComponentsTypes";

  import { appTheme } from "$lib/stores/sideBarAndTheme.svelte";
  import { createCard, updateCard, validateDial } from "$lib/stores/timerWatch.svelte";
  import { createAlarm, updateAlarm } from "$lib/stores/alarms.svelte";
  
  let { closeForm, formName, Text="", Dial=[0,0,0,0,0,0], ind=-1, change, digitsLen=6, alarm=false }: PropsForm = $props()
                                                                      
  let modal: HTMLElement;
  let name: string = $state(Text)
  let isTimerInvalid: boolean = $state(false);
  let isDialValid: boolean = $state(false)

  let digits: dialTime = $state(Dial);

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeForm()
    } else if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
  });


  function increament(digit: number, maxNum: number): number {
    if (digit < maxNum) {
      return  1
    }
    return -maxNum
  };
  
  function deincreament(val: number, maxNum: number): number {
    if (val > 0) {
      return  1
    }
    return -maxNum
  };

  function submit() {
    isDialValid = validateDial(digits)
    if (name && isDialValid) {
      if (alarm) {
        let num = parseInt(digits.slice(0, 4).join(''))

        if (num > 2359) {
          digits[0] = 0
          digits[1] = 0
          digits[2] = 0
          digits[3] = 0
        }
        if (change) {
          updateAlarm(ind, name, [digits[0], digits[1], digits[2], digits[3]])
        } else {
          createAlarm(name, [digits[0], digits[1], digits[2], digits[3]])
        }
      } else {
        if (change) {
          updateCard(ind, name, digits, digits)
        } else {
          createCard(String(name),digits, digits)
        }
      }
      closeForm()
    } else {
      isTimerInvalid = true
    }
  };

</script>

<div class="add-form" bind:this={modal} draggable="false">
  <div class={["modal", { "light": appTheme.light }]}>
    <h2>{formName}</h2>
    <input class={["input-name", { invalid: isTimerInvalid }]} placeholder="Text" bind:value={name} />
    <div class={["dial", { "light": appTheme.light, "invalid": isTimerInvalid  && !isDialValid }]}>
      <div class="digit">
        {#each Array.from({ length: digitsLen }) as _, i (i)}
          <div class="digit-arrows">
            <button class="arrow" onclick={() => digits[i] += increament(digits[i], (i === 2 || i === 4) ? 5 : 9)} tabindex=-1>
              <img src="icons/formsButtons/caret-up.svg" alt="Up" />
            </button>
            <input class="input-num" type="number" bind:value={digits[i]} min="0" max={(i === 2 || i === 4) ? 5 : 9} placeholder="0"/>
            <button class="arrow" onclick={() => digits[i] -= deincreament(digits[i], (i === 2 || i === 4) ? 5 : 9)} tabindex=-1>
              <img src="icons/formsButtons/caret-down.svg" alt="Down" />
            </button>
          </div>
          {#if i % 2 === 1 && i < digitsLen-1}
            <span class="colon">:</span>
          {/if}
        {/each}
        </div>
      </div>
      <div class="action-buttons"> 
        <button class="btn-bottom" onclick={ submit }>{ !change ? "add": "save"}</button>
        <button class="btn-bottom" onclick={ closeForm }>Cancel</button>
      </div>
    </div>
</div>

<style>

  .add-form {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 30px;
    z-index: 15;
    user-select: auto;
    -webkit-user-drag: none;
    pointer-events: auto;
  }
  
  .modal {
    background: rgb(69, 69, 69);
    color: #ffffff;
    padding: 1.5rem;
    border-radius: 2px;
    width: clamp(230px, 45vw, 600px);
    font-size: clamp(0.9rem, 2vw, 1.3rem);
    padding: clamp(1rem, 5vw, 2.5rem);
    font-family: dark-theme-font;
    box-shadow: 0 0 10px #000;
  }

  .modal.light {
    background: #fff4e9;
    color: #3B2F2F;
    border-radius: 20px;
    font-family: serif;
  }

  
  .modal.light .input-name,
  .modal.light button {
    color: #3B2F2F;
    font-family: serif;
    border-radius: 5px;
    
  }

  .modal.light .digit-arrows {
    color: #3B2F2F;
    font-size: clamp(1rem, 6vw, 5rem);
    font-family: serif;
  }
  
  .input-name {
    color: #ffffff;
    border: none;
    background: #00000024;
    box-sizing: border-box;
    font-size: clamp(0.8rem, 1.5vw, 2rem);
    font-family: dark-theme-font;
    padding: clamp(0.6rem, 1.5vw, 1rem);
    margin-bottom: 1.5vh;
    width: 100%;
  }

  .input-name.invalid {
    background:rgba(255, 0, 0, 0.237);
  }
  .input-name:focus {
    outline: none;
  }
  
  .dial {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
  }

  .dial.light .colon {
    color: #3B2F2F;
    font-family: serif;
    font-size: clamp(30px, 5vw, 60px);
    margin-right: clamp(5px, 1vw, 12px);
    line-height: 2.8;
  }
  .dial.light .input-num {
    color: #3B2F2F;
    font-family: serif;
  }
  .dial.light .arrow img {
    filter: invert(10%) opacity(85%);
  }

  .dial.light .digit {
    width: clamp(50px, 10vw, 140px);
  }

  .dial.light .digit-arrows {
    width: clamp(25px, 4vw, 50px);
  }

  .dial.invalid .digit-arrows {
    background: rgba(255, 0, 0, 0.237);
  }

  .digit {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: clamp(10px, 10vw, 120px);
  }
  .digit-arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: clamp(20px, 3vw, 40px);
  }

  .input-num {
    font-size: clamp(2rem, 5vw, 4rem);
    width: clamp(2rem, 6vw, 4rem);
    height: 100%;
    text-align: center;
    color: #eee;
    background: none;
    border: none;
    font-family: dark-theme-font;
  }

  .input-num::-webkit-inner-spin-button,
  .input-num::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  .input-num:focus {
    outline: none;
  }

  .arrow {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .arrow img {
    width: clamp(1.3rem, 3vw, 3rem);
    height: 100%;
    filter: invert(90%) opacity(80%);
  }

  .colon {
    display: flex;
    height: 100%;
    width: 1%;
    color: #eee;
    line-height: 3;
    margin-right: 5px;
    font-size: clamp(30px, 5vw, 60px);
    font-family: dark-theme-font;
  }
  .action-buttons {
    box-sizing: border-box;
    display: flex;
    gap: clamp(0.5rem, 1.5vw, 1rem);
    margin-top: clamp(1rem, 2vh, 2rem);
    justify-content: flex-end;
    width: 100%;
    margin-left: 10px
  }

  .btn-bottom {
    display: flex;  
    justify-content: flex-end;
    color: #ffffff;
    border: none;
    background: none;
    font-family: dark-theme-font;
    font-size: clamp(1rem, 2vw, 2rem);
    padding: clamp(0.3rem, 0.8vw, 0.6rem) clamp(0.6rem, 2vw, 1rem);
    font-weight: bold;
  }
  .arrow:hover,
  .btn-bottom:hover {
    transition: transform 0.3s ease;
    transform: scale(1.5);
  }

</style>