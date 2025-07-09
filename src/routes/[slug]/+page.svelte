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

<div id='poem'>
  <h1 id='title'>{ data.title }</h1>
  <div id='text'>
    {#each data.poem as line}
      <span class='line'>{line}</span>
    {/each}
  </div>
</div>

<style>
  #poem {
    height: 100%;
    width: 80%;
    margin: 0 auto;
    background-color: #051021;
    font-family: Arial, Helvetica, sans-serif;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  #poem #title {
    margin: 0 0 10%;
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