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
  <span id='ellipsis' class='cell'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
  {#each data.shortTailOfPi as digit, i}
    <span class='digit cell' style="--duration: {randomIntBetween(3000, 8000)}ms; --distance: {randomIntBetween(5, 20)}%;">
    {#if metaAt(i) === undefined}
      <span class='y-drift'>
        {digit}
      </span>
    {:else}
      <a href={routeForPoemAt(i)} class='x-drift'>
        {digit}
      </a>
    {/if}
    </span>
  {/each}
</div>

<style>
  .matrix {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 1%;
  }

  span.cell {
    padding: 5%;
    color: #BEEEFF;
    display: flex;
  }
  
  span#ellipsis {
    font-family: 'Trebuchet MS';
    transform: translateY(25%);
  }
  
  span.digit {
    font-size: 30px;
    font-family: sans-serif;
    justify-content: center;
    align-items: center;
  }

  span a {
    color: #BEEEFF;
    font-size: 150%;
    text-decoration: none;
  }

  .x-drift {
    animation: xDrift var(--duration) linear infinite alternate;
  }

  .y-drift {
    animation: yDrift var(--duration) linear infinite alternate;
  }

  @keyframes xDrift {
    from {
      transform: translateX(var(--distance));
    }
    to {
      transform: translateX(calc(var(--distance) * -1));
    }
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