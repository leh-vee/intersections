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
  }
  
  #page #poem {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #page #text {
    z-index: 1;
    width: 80%;
    height: 100%;
    font-weight: 200;
    color: gold;
  }
  
  .line {
    white-space: nowrap;
    display: block;
  }

  .line:first-child {
    padding-top: 30px;
  }

  .line:last-child {
    padding-bottom: 100px;
  }

  #page #title {
    position: absolute;
    height: 50px;
    z-index: 2;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
  }
  
  #title h1 {
    color: white;
    margin: 0;
    width: 80%;
  }

  #page #button {
    position: absolute;
    z-index: 2;
    bottom: 10px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #button button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 3lh;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    aspect-ratio: 1 / 1;
  }
  
  #button button:active {
    border-color: gold;
  }

</style>