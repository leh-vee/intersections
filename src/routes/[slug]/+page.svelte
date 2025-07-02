<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<div id='page'>
  <p id='title'>{ data.title }</p>
  <div id="poem">
    {#each data.poem as line, i}
      <span class='line'>{line}</span>
    {/each}
  </div>
</div>

<style>
  #page {
    /* font-family: Verdana, Geneva, Tahoma, sans-serif; */
    font-family: Arial, Helvetica, sans-serif;
    margin: 10px;
    color: white;
  }

  #title {
    font-size: 10em;
    margin: 10px 0;
    width: fit-content;
    white-space: nowrap;
    text-align: center;
  }

  #poem {
    font-size: 8em;
    line-height: 1.3;
    width: 100%;
  }
  
  .line {
    display: block;
    width: fit-content;
    white-space: nowrap;
  }
</style>