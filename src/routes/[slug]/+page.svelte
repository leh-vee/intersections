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

  /* .line:last-child {
    padding-bottom: 120px;
  } */
</style>