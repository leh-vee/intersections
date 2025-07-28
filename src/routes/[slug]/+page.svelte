<script>
  import { onMount } from 'svelte';
  import fitty from 'fitty';
	import MapTiles from '$lib/MapTiles.svelte';

  let { data } = $props();

  let isLit = $state(false);

  let lineEls = $state([]);
  let nLines = $derived(lineEls.length);
  let nLineFitEventCalls = $state(0);
  let areLinesFitted = $derived(nLineFitEventCalls === nLines && nLines > 0);

  onMount(() => {
    lineEls.forEach(el => el.addEventListener('fit', () => nLineFitEventCalls++ ));
    fitty('#poem #text .line');
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
      const poemElHeight = poemElRect.height;
      if (poemElHeight >= 100) isOverflowing = true;
    }
    return isOverflowing;  
  });

  function lightBurst() {
    isLit = true;
    setTimeout(() => {
      isLit = false;
    }, 50);
  }
</script>

<MapTiles centreCoordsGcs={ [-79.306775909005395, 43.705856672084899] } gild={ isLit } />
<div id='page' style="visibility: {areLinesFitted ? 'visible' : 'hidden'};">
  <div id='title'>
    <h1>{ data.title }</h1>
  </div>
  <div id='poem' bind:this={ poemEl }>
    <div id='text' style:padding-bottom="{isPoemOverflowing ? btnElTop : 0}px">
      {#each data.poem as line, i}
        <span class='line' bind:this={ lineEls[i] }>{line}</span>
      {/each}
    </div>
  </div>
  <div id='more'>
    <button bind:this={ btnEl } onclick={ lightBurst }>3</button>
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
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  #page > div {
    padding: 0;
    width: 100%;
    z-index: 1;
  }
  
  #page #title {
    min-height: 100px;
    flex-grow: 1;
    position: relative;
  }
  
  #page #poem {
    overflow-y: scroll;
    position: relative;
    bottom: 2px;
  }

  #page #more {
    flex-grow: 1;
  }
  
  #title h1 {
    border-bottom: 2px solid black;
    color: ghostwhite;
    position: absolute;
    bottom: 0px;
    width: 100%;
    margin: 0 10%;
  }
  
  #more button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 4dvh;
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
  }
</style>