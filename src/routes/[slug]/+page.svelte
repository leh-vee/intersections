<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';
  import fitty from 'fitty';

  onMount(() => {
    fitty('#text .line');
    // fitty('#title h5');
  });

  let { data }: PageProps = $props();
</script>

<div id='vessel'>
  <div id='title'>
    <h2>{ data.title }</h2>
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
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  #vessel #title {
    width: 90%;
    flex-grow: 1;
    position: relative;
    padding: 0;
  }
  
  #title h2 {
    color: black;
    margin: 0;
    position: absolute;
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
    background-color: #051021;
    color: white;
    font-size: 40px;
    border-radius: 50%;
    height: 75px;
    
    width: 75px;
    position: absolute;
    bottom: 20px;
  }

  #button button:active {
    background-color: gold;
  }
  
  #vessel #poem {
    background-color: #051021;
    padding: 0;
    max-height: 80%;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  #vessel #text {
    width: 80%;
    font-weight: 400;
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