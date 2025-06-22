<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();

  function metaAt(index: number) {
    return data.metaTailMap[index];
  } 

  function routeForPoemAt(index: number) {
    return `/${data.metaTailMap[index].slug}`;
  }

  function randomIntBetween(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }
</script>

<div class='matrix'>
  <span id='ellipsis'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
  {#each data.shortTailOfPi as digit, i}
    {#if metaAt(i) === undefined}
      <span class='digit'>
        <span class='y-drift' style="--duration: {randomIntBetween(3000, 8000)}ms; --distance: {randomIntBetween(15, 30)}%;">
          {digit}
        </span>
      </span>
    {:else}
      <span class='digit'>
        <a class='x-drift' href={routeForPoemAt(i)}>
          {digit}
        </a>
      </span>
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

  span#ellipsis {
    font-family: 'Trebuchet MS';
  }

  span {
    font-family: sans-serif;
    font-size: 30px;
    padding: 5%;
    color: dimgrey;
    display: flex;
  }

  span a {
    color: #BEEEFF;
    text-decoration: none;
  }

  .y-drift {
    animation: yDrift var(--duration) linear infinite alternate;
  }

  @keyframes yDrift {
    from {
      transform: translateY(var(--distance));
    }
    to {
      transform: translateY(calc(var(--distance) * -1));
    }
  }
</style>