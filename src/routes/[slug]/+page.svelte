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
    <h3>{ data.title }</h3>
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
  
  #title h3 {
    margin: 0;
  }
  
  #vessel #button {
    flex-grow: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  #button button {
    background-color: red;
    border-radius: 20%;
    border: 1px solid goldenrod;
    width: 50px; 
    height: 50px; 
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