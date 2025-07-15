<script>
  import { onMount } from 'svelte';
  import fitty from 'fitty';
	import MapTiles from '$lib/MapTiles.svelte';

  onMount(() => {
    fitty('#text .line');
    // fitty('#title h5');
  });

  let { data } = $props();

  let isLit = $state(false);

  function lightBurst() {
    console.log('light burst');
    isLit = true;
    setTimeout(() => {
      isLit = false;
    }, Math.PI * 1000);
  }
</script>

<div id='vessel'>
  <MapTiles centreCoordsGcs={ [-79.306775909005395, 43.705856672084899] } gild={ isLit } />
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
    <button>3</button>
  </div>
</div>

<style>
  #vessel {
    background-color: white;
    height: 100%;
    width: 100%;
    margin: 0;
    font-family: 'Helvetica Neue', sans-serif;
    color: ghostwhite;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  #vessel #title {
    width: 80%;
    flex-grow: 1;
    position: relative;
    padding: 0;
  }
  
  #title h1 {
    margin: 0;
    font-weight: 700;
    position: absolute;
    color: black;
    -webkit-text-stroke: 1px white;
    bottom: 5px;
  }
  
  #vessel #button {
    width: 100%;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    position: relative;
  }
  
  #button button {
    font-family: "Rubik", sans-serif;
    background-color: #051021;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 45px;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    position: absolute;
    bottom: 20px;
  }
  
  #button button:active {
    border-color: gold;
  }
  
  #vessel #poem {
    padding: 0;
    max-height: 80%;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1;
  }
  
  #vessel #text {
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