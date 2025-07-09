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
    <h4>{ data.title }</h4>
  </div>
  <div id='poem'>
    <div id='text'>
      {#each data.poem as line}
        <span class='line'>{line}</span>
      {/each}
    </div>
  </div>
  <div id='button'>
    <button></button>
  </div>
</div>

<style>
  #vessel {
    height: 100%;
    width: 100%;
    margin: 0;
    background-color: #051021;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  #vessel #title {
    flex-grow: 1;
    width: 80%;
    display: flex;
    align-items: end;
  }
  
  #title h4 {
    border-bottom: 1px solid cornflowerblue;
    margin: 0;
  }
  
  #vessel #button {
    flex-grow: 1;
    width: 100%;
    display: flex;
    align-items: start;
    justify-content: center;
  }
  
  #button button {
    background-color: red;
    border-radius: 50%;
    width: 75px; 
    height: 75px; 
    border: 1px solid cornflowerblue; 
    color: beige;
    font-size: 16px; /* Adjust as needed */
  }
  
  #vessel #poem {
    height: 66%;
    overflow-y: scroll;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #vessel #text {
    width: 80%;
    font-weight: 400;
  }
  
  .line {
    white-space: nowrap;
    display: inline-block;
  }
</style>