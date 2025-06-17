<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  function metaAt(index: number) {
    return data.metaTailMap[index];
  } 

  function routeForPoemAt(index: number) {
    return `/${data.metaTailMap[index].slug}`;
  }
</script>

<div class='matrix'>
  <span id='ellipsis'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
  {#each data.shortTailOfPi as digit, i}
    {#if metaAt(i) === undefined}
      <span class='digit'>{digit}</span>
    {:else}
      <span class='digit'><a href={routeForPoemAt(i)}>{digit}</a></span>
    {/if}
  {/each}
</div>

<style>
  .matrix {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 1%;
  }

  span {
    font-family: sans-serif;
    font-size: 30px;
    padding: 5%;
    color: dimgrey;
  }

  span a {
    color: gold;
    text-decoration: none;
  }

  span#ellipsis {
    font-family: 'Trebuchet MS';
  }
</style>