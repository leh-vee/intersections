<script lang="ts">
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
  
  let longestLineEl: HTMLElement | null = $state(null);

  let fontSize = $state(60);

  let lineLengths = $derived(data.poem.map(line => line.length));
  let longestLineIndex = $derived(lineLengths.indexOf(Math.max(...lineLengths)));

  $effect(() => {
    if (longestLineEl && longestLineEl.scrollWidth > (window.outerWidth - 60)) {
      smallerFontSize();
    }
  });
  
  function smallerFontSize() {
    fontSize = fontSize - 1; 
    console.log('font size', fontSize);
  }

</script>

<h1 id='title'>{ data.poemTitle }</h1>
<div id="poem" style:font-size={ `${fontSize}px`} >
  {#each data.poem as line, i}
    {#if i === longestLineIndex}
      <span class='line longest' bind:this={ longestLineEl } >{line}</span>
    {:else}
      <span class='line'>{line}</span>
    {/if}
  {/each}
</div>

<style>
  #title {
    color: ghostwhite;
    text-align: center;
    font-family: "Lilita One", sans-serif;
    font-size: 2em;
    margin: 15px 0 0;
    border-radius: 5px;
  }

  #poem {
    color: whitesmoke;
    font-family: "EB Garamond", serif;  
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

  .line.longest {
    color: #ff6347; /* tomato */
  }
</style>