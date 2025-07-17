<script>
  import { onMount } from 'svelte';
  import fitty from 'fitty';
	import MapTiles from '$lib/MapTiles.svelte';

  onMount(() => {
    fitty('#text .line');
  });

  let { data } = $props();

  let isLit = $state(false);

  function lightBurst() {
    isLit = true;
    setTimeout(() => {
      isLit = false;
    }, 50);
  }
</script>

<MapTiles centreCoordsGcs={ [-79.306775909005395, 43.705856672084899] } gild={ isLit } />
<div id='page'>
  <div id='title'>
    <h1>{ data.title }</h1>
  </div>
  <div id='poem'>
    <div id='text'>
      {#each data.poem as line}
        <span class='line'>{line}</span>
      {/each}
    </div>
  </div>
  <div id='button'>
    <button onclick={ lightBurst }>3</button>
  </div>
</div>

<style>
  #page {
    height: 100%;
    width: 100%;
    margin: 0;
    font-family: 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #page > div {
    z-index: 1;
    flex-grow: 1;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  #page #title {
    justify-content: flex-end;
    align-items: flex-start;
  }
  
  #page #poem {
    justify-content: flex-start;
    padding: 0;
    height: 60%;
    overflow-y: scroll;
    width: 100%;
  }

  #page #button {
    justify-content: center;
  }

  #title h1 {
    margin: 0;
    color: ghostwhite;
    position: relative;
    bottom: 5px;
  }
  
  #button button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 3lh;
    border-radius: 50%;
    padding: 5%;
    width: fit-content;
    aspect-ratio: 1 / 1;
  }
  
  #button button:active {
    border-color: gold;
  }
  
  #page #text {
    width: 80%;
    font-weight: 200;
    color: gold;
  }
  
  .line {
    white-space: nowrap;
    display: block;
  }

  .line:first-child {
    padding-top: 25px;
  }

  .line:last-child {
    padding-bottom: 25px;
  }
</style>