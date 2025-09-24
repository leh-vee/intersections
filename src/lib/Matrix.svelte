<script>
  import { poemIndex, longTailOfPi } from '$lib/store.js';

  function metaAt(index) {
    return metaTailMap[index];
  } 

  function routeForPoemAt(index) {
    return `/${metaTailMap[index]}`;
  }

  function randomIntBetween(low, high) {
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  const metaTailMap = new Array();
  const takenTailIndices = [];

  Object.keys($poemIndex).forEach(slug => {
    const sefirahId = $poemIndex[slug].sefirahId;
    const tailIndex = $longTailOfPi.findIndex((d, i) => {
      return sefirahId === d && !takenTailIndices.includes(i);
    });
    metaTailMap[tailIndex] = slug;
    takenTailIndices.push(tailIndex);
  })

  const shortTailLength = Math.max(metaTailMap.length, 100);
  const shortTailOfPi = $longTailOfPi.slice(0, shortTailLength);
</script>

<div class='matrix'>
  <span id='ellipsis' class='cell'><a href="https://here-i-am.me/" target="_blank">&hellip;</a></span>
  {#each shortTailOfPi as digit, i}
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
    font-size: 125%;
  }
  
  span.digit {
    font-size: 30px;
    font-family: "Rubik", sans-serif;
    font-optical-sizing: auto;
    font-weight: 300;
    justify-content: center;
    align-items: center;
  }

  span a {
    color: #BEEEFF;
    text-decoration: none;
    font-weight: 400;
  }

  .digit a {
    font-size: 150%;
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