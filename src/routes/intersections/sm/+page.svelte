<script lang="ts">
  import type { PageProps } from './$types';
  let { data }: PageProps = $props();
</script>

<h1 id='title'>M.& S.</h1>
<div id="poem">
  {#each data.poem as line}
    <span class='line'>{line}</span>
  {/each}
</div>

<style>
  #title {
    color: ghostwhite;
    text-align: center;
    font-family: Georgia, serif;
    font-size: 5em;
    margin: 15px 0 0;
    border-radius: 5px;
  }

  #poem {
    color: whitesmoke;
    font-family: "EB Garamond", serif;
    font-size: 2.3em;  
    line-height: 1.4;
    margin: 0 5px 10px;
    padding: 10px 20px;
  }

  .line {
    display: block;
  }
</style>