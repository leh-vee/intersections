<script>
  import { poemIndex } from '$lib/store.js';
  import { fetchPoemLines } from '$lib/api/drive';
  import fitty from 'fitty';
  import StreetLines from '$lib/StreetLines.svelte';
  import HitMeButton from '$lib/HitMeButton.svelte';

  let { id } = $props();

  const poemMetaData = $poemIndex[id];

  let sefirahId = $derived(poemMetaData.sefirahId);
  let coords = $derived(poemMetaData.coordinates);
  let poemLines = $state([]);

  $effect(() => {
    if (poemLines.length === 0) {
      (async () => {
        const lines = await fetchPoemLines(poemMetaData.docId);
        poemLines = lines;
      })();
    }
  });
  
  let lineEls = $state([]);
  let nLines = $derived(lineEls.length);
  let nLineFitEventCalls = $state(0);
  let areLinesFitted = $derived(nLineFitEventCalls === nLines && nLines > 0);
  let isPoemVisible = $state(false);

  let fittyLineEls;

  $effect(() => {
    if (poemLines.length > 0) {
      lineEls.forEach((el, i) => el.addEventListener('fit', () => nLineFitEventCalls++ ));
      fittyLineEls = fitty('#poem #text .line', { minSize: 8, maxSize: 2000 });
    }
  });

  $effect(() => {
    if (areLinesFitted && !isPoemVisible) {
      fittyLineEls.forEach(el => el.freeze());
      isPoemVisible = true;
    }
	});

  let isLit = $state(false);
  let isTyping = false;

  function lightBurst(event) {
    if (isTyping) return null;
    isLit = true;
    if (nextLineToType < nLines) typeLine();
    setTimeout(() => {
      isLit = false;
    }, 50);
    return true;
  }

  let nextLineToType = 0;

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function typeLine() {
    isTyping = true;
    const lineEl = lineEls[nextLineToType];
    const elTextContent = lineEl.textContent;
    const text = elTextContent;
    let nextCharIndex = 1;
    let addCharIntervalId;
    const typeChar = () => {
      lineEl.textContent = text.slice(0, nextCharIndex);
      const char = text.slice(nextCharIndex - 1, nextCharIndex);
      if (nextCharIndex < elTextContent.length) {
        if (nextCharIndex === 1) lineEl.style.visibility = 'visible';
        nextCharIndex += 1;
        let typingDelay = randomInt(100, 200);
        if (/[.,;:!?[\]{}\–—]/.test(char)) typingDelay = randomInt(1000, Math.PI * 1000);
        setTimeout(typeChar, typingDelay);
      } else {
        nextLineToType += 1;
        isTyping = false;
      }
    }
    typeChar();
  }

  const title = poemMetaData.title;
  let lastTitleIndex = $state(0);
  let typedTitle = $derived(title.slice(0, lastTitleIndex));

  function typeTitle() {
    const typeChar = () => {
      lastTitleIndex = lastTitleIndex + 1;
      if (typedTitle.length < title.length) {
        setTimeout(typeChar, 1000);
      }
    }
    typeChar();
  }

  let poemEl;
  let poemOverflowPx = $state(0);
  let btnCentrePx = $state(false);

  function finalizeLayout(event) {
    console.log('button drawn from Poem');
    const btnRect = event.detail;
    btnCentrePx = [
      btnRect.left + btnRect.width / 2,
      btnRect.top + btnRect.height / 2
    ];
    const poemRect = poemEl.getBoundingClientRect();
    if (poemRect.bottom > btnRect.top) {
      poemOverflowPx = Math.ceil(
        Math.min(
          (poemRect.bottom - btnRect.top + 5) * 2, // text overflows button but not the screen; the 5 adds a margin
          window.innerHeight - btnRect.top + 5 // text overflows the screen; the 5 adds a margin 
        )
      );
    }
  }
</script>

{#if btnCentrePx}
  <StreetLines centreCoordsGcs={ coords } centreOnPx= { btnCentrePx } rotationFactor={ Number(sefirahId) } gild={ isLit } />
{/if}
<div id='page' style="visibility: {isPoemVisible ? 'visible' : 'hidden'};">
  <div id='title'>
    {#if btnCentrePx}
      <h3>{ title }</h3>
    {/if}
  </div>
  <div id='poem' bind:this={ poemEl }>
    <div id='text' style:padding-bottom="{ poemOverflowPx }px">
      {#each poemLines as line, i}
        <span class='line' bind:this={ lineEls[i] }>{ line }</span>
      {/each}
    </div>
  </div>
  <div id='spacer'></div>
  {#if areLinesFitted }
    <HitMeButton piSlice={ sefirahId } on:drawn={ finalizeLayout } on:clicked={ lightBurst } />
  {/if}
</div>

<style>
  #page {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    margin: 0;
    font-family: 'Helvetica Neue', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
  }
  
  #page > div {
    padding: 0;
    width: 100%;
    z-index: 1;
  }
  
  #page #title {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  
  #page #poem {
    overflow-y: scroll;
    position: relative;
    bottom: 2px;
  }

  #page #spacer {
    flex: 1;
  }
  
  #title h3 {
    font-weight: 400;
    border-bottom: 2px solid black;
    color: ghostwhite;
    width: 80%;
    margin: 0 auto;
    padding: 5px 0;
  }
  
  #poem #text {
    width: 80%;
    margin: 0 auto;
    font-weight: 200;
    color: gold;
  }
  
  .line {
    white-space: nowrap;
    display: block;
    visibility: hidden;
  }
</style>