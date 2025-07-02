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
    margin: 1px;
    color: white;
  }

  #title {
    font-size: 0.7em;
    margin: 5px 0;
    width: fit-content;
    white-space: nowrap;
    text-align: center;
  }

  #poem {
    font-size: 0.1em;
    line-height: 1.3;
    width: 100%;
  }
  
  .line {
    display: block;
    width: fit-content;
    white-space: nowrap;
  }
</style>