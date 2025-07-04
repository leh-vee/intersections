<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageProps } from './$types';
  import fitty from 'fitty';

  onMount(() => {
    fitty('#text .line');
    fitty('#title');
  });

  let { data }: PageProps = $props();
</script>

<div id='surface'>
  <div id='card'>
    <div id='poem'>
      <h1 id='title'>{ data.title }</h1>
      <div id='text'>
        {#each data.poem as line}
          <span class='line'>{line}</span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  #surface {
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #card {
    width: 90%;
    height: 95%;
    border-radius: 5px;
    padding: 5px;
    background-color: #051021;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #poem {
    width: 80%;
  }

  #poem #title {
    margin: 0 0 5%;
  }
  
  #poem #text {
    font-weight: 400;
    width: 100%;
  }
  
  .line {
    display: block;
    width: fit-content;
    white-space: nowrap;
    display: inline-block;
    white-space: nowrap;
  }
</style>