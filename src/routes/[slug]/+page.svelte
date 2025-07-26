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

  $effect(() => {
    if (areLinesFitted) setPoemMargin();
	});

  onMount(() => {
    lineEls.forEach(el => {
      el.addEventListener('fit', function (e) {
        nLineFitEventCalls++;
      });
    });
    fitty('#poem #text .line');
  });
  
  let buttonEl, buttonContainerEl, blankEl;
  let blankHeight = $state(0);

  function setPoemMargin() {
    const btnRect = buttonEl.getBoundingClientRect();
    const btnContainerRect = buttonContainerEl.getBoundingClientRect();
    const distanceToButtonTop = window.innerHeight - btnRect.top;
    const containerHeight = btnContainerRect.height;
    const heightDifference = distanceToButtonTop - containerHeight;
    blankHeight = heightDifference > 0 ? heightDifference : 0;
  }

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
  <div id='poem'>
    <div id='text'>
      {#each data.poem as line, i}
        <span class='line' bind:this={ lineEls[i] }>{line}</span>
      {/each}
    </div>
    <div bind:this={ blankEl } id='blank' style="height: {blankHeight}px;"></div>
  </div>
  <div bind:this={ buttonContainerEl } id='button'>
    <button bind:this={ buttonEl } onclick={ lightBurst }>3</button>
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
    min-height: 10%;
    flex-grow: 1;
    position: relative;
  }
  
  #page #poem {
    overflow-y: scroll;
  }

  #poem #blank {
    width: 100%;
  }

  #page #button {
    flex-grow: 1;
  }
  
  #title h1 {
    border-bottom: 1px solid black;
    color: ghostwhite;
    position: absolute;
    bottom: 0px;
    width: 100%;
    margin: 0 10%;
  }
  
  #button button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 45px;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    position: absolute;
    bottom: 20px;
    right: calc(50% - 50px);
  }
  
  #button button:active {
    border-color: gold;
  }
  
  #page #text {
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