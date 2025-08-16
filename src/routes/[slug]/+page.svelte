<script>
  import { onMount } from 'svelte';
  import fitty from 'fitty';
	import MapTiles from '$lib/MapTiles.svelte';

  let { data } = $props();
  
  let lineEls = $state([]);
  let nLines = $derived(lineEls.length);
  let nLineFitEventCalls = $state(0);
  let areLinesFitted = $derived(nLineFitEventCalls === nLines && nLines > 0);
  let isPoemVisible = $state(false);

  let fittyLineEls;

  onMount(() => {
    lineEls.forEach((el, i) => el.addEventListener('fit', () => nLineFitEventCalls++ ));
    fittyLineEls = fitty('#poem #text .line', { minSize: 8 });
  });

  $effect(() => {
    if (areLinesFitted) {
      fittyLineEls.forEach(el => el.freeze());
      isPoemVisible = true;
    }
	});

  let btnEl = $state(false);
  
  let btnElTop = $derived.by(() => {
    let top = 0;
    if (btnEl) {
      const btnElRect = btnEl.getBoundingClientRect();
      top = window.innerHeight - btnElRect.top;
    }
    return top;
  });
  
  let poemEl = $state(false); 
  
  let isPoemOverflowing = $derived.by(() => {
    let isOverflowing = false;
    if (poemEl && areLinesFitted) {
      const poemElRect = poemEl.getBoundingClientRect();
      const deltaFromBottom = window.innerHeight - poemElRect.bottom;
      if (deltaFromBottom <= 100) isOverflowing = true;
    }
    return isOverflowing;  
  });

  let isLit = $state(false);
  let isTyping = false;

  function lightBurst() {
    if (isTyping) return null;
    isLit = true;
    if (nextLineToType < nLines) typeLine();
    setTimeout(() => {
      isLit = false;
    }, 50);
    return true;
  }

  let nextLineToType = 0;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function typeLine() {
    isTyping = true;
    const lineEl = lineEls[nextLineToType];
    const elTextContent = lineEl.textContent;
    const text =  elTextContent;
    let nextCharIndex = 1;
    let addCharIntervalId;
    const typeChar = () => {
      const char = text.slice(nextCharIndex - 1, nextCharIndex);
      lineEl.textContent = text.slice(0, nextCharIndex);
      if (nextCharIndex < elTextContent.length) {
        if (nextCharIndex === 1) lineEl.style.visibility = 'visible';
        nextCharIndex += 1;
        let typingDelay = randomInt(100, 200);
        if (/[.,;:!?[\]{}\–—]/.test(char)) typingDelay = randomInt(1000, Math.PI * 1000);
        setTimeout(typeChar, typingDelay);
      } else {
        nextLineToType += 1;
        isTyping = false;
      }
    }
    typeChar();
  }


</script>

<MapTiles centreCoordsGcs={ data.coords } gild={ isLit } />
<div id='page' style="visibility: {isPoemVisible ? 'visible' : 'hidden'};">
  <div id='title'>
    <h3>{ data.title }</h3>
  </div>
  <div id='poem' bind:this={ poemEl }>
    <div id='text' style:padding-bottom="{isPoemOverflowing ? btnElTop : 0}px">
      {#each data.poem as line, i}
        <span class='line' bind:this={ lineEls[i] }>{line}</span>
      {/each}
    </div>
  </div>
  <div id='more'>
    <button bind:this={ btnEl } onclick={ lightBurst }>{ data. sefirahId }</button>
  </div>
</div>

<style>
  #page {
    background-color: white;
    height: 100%;
    width: 100%;
    margin: 0;
    font-family: 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  
  #page > div {
    padding: 0;
    width: 100%;
    z-index: 1;
  }
  
  #page #title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  #page #poem {
    overflow-y: scroll;
    position: relative;
    bottom: 2px;
  }

  #page #more {
    flex: 1;
  }
  
  #title h3 {
    font-weight: 400;
    border-bottom: 2px solid black;
    color: ghostwhite;
    width: 80%;
    margin: 0 auto;
    padding: 5px 0;
  }
  
  #more button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 45px;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    position: absolute;
    bottom: 2dvh;
    right: calc(50% - 50px);
  }
  
  #more button:active {
    border-color: gold;
  }
  
  #poem #text {
    width: 80%;
    margin: 0 auto;
    font-weight: 200;
    color: gold;
  }
  
  .line {
    white-space: nowrap;
    display: block;
    visibility: hidden;
  }
</style>