<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<h1 id='title'>{ data.title }</h1>
<div id="poem">
  {#each data.poem as line, i}
    <span class='line'>{line}</span>
  {/each}
</div>

<style>
  #title {
    color: white;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    font-weight: 400;
    font-size: 2em;
    margin: 15px 0 0;
    border-radius: 5px;
  }

  #poem {
    color: white;
    font-family: "Newsreader", serif;
    font-optical-sizing: auto;
    font-weight: 200;
    font-size: 40px;
    line-height: 1.4;
    margin: 0 5px 10px;
    padding: 10px 20px;
    overflow: hidden;
    width: 100%;
  }
  
  .line {
    display: block;
    width: fit-content;
    white-space: nowrap;
  }
</style>