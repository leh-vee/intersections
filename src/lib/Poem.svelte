<script>
  import { poemIndex } from '$lib/store.js';
  import { fetchPoemLines } from '$lib/api/drive';
  import fitty from 'fitty';
  import StreetLines from '$lib/StreetLines.svelte';

  let { id } = $props();

  let poemMetaData = $derived($poemIndex[id]);
  let title = $derived(poemMetaData.title);
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
    if (areLinesFitted) {
      fittyLineEls.forEach(el => el.freeze());
      isPoemVisible = true;
    }
	});

  let btnEl = $state(false);
  let btnCentrePx = $derived.by(() => {
    let px = [0, 0];
    if (btnEl) {
      const btnElRect = btnEl.getBoundingClientRect();
      px = [
        btnElRect.left + btnElRect.width / 2,
        btnElRect.top + btnElRect.height / 2
      ];
    }
    return px;
  });

  
  let btnElTop = $derived.by(() => {
    let top = 0;
    if (btnEl) {
      const btnElRect = btnEl.getBoundingClientRect();
      top = window.innerHeight - btnElRect.top;
    }
    return top;
  });
  
  let poemEl = $state(false); 
  
  let isPoemOverflowing = $derived.by(() => {
    let isOverflowing = false;
    if (poemEl && areLinesFitted) {
      const poemElRect = poemEl.getBoundingClientRect();
      const deltaFromBottom = window.innerHeight - poemElRect.bottom;
      if (deltaFromBottom <= 100) isOverflowing = true;
    }
    return isOverflowing;  
  });

  let isLit = $state(false);
  let isTyping = false;

  function lightBurst() {
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
    const text =  elTextContent;
    let nextCharIndex = 1;
    let addCharIntervalId;
    const typeChar = () => {
      const char = text.slice(nextCharIndex - 1, nextCharIndex);
      lineEl.textContent = text.slice(0, nextCharIndex);
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


</script>

<StreetLines centreCoordsGcs={ coords } centreOnPx= { btnCentrePx } rotationFactor={ Number(sefirahId) } gild={ isLit } />
<div id='page' style="visibility: {isPoemVisible ? 'visible' : 'hidden'};">
  <div id='title'>
    <h3>{ title }</h3>
  </div>
  <div id='poem' bind:this={ poemEl }>
    <div id='text' style:padding-bottom="{isPoemOverflowing ? btnElTop : 0}px">
      {#each poemLines as line, i}
        <span class='line' bind:this={ lineEls[i] }>{line}</span>
      {/each}
    </div>
  </div>
  <div id='more'>
    <button bind:this={ btnEl } onclick={ lightBurst }>{ sefirahId }</button>
  </div>
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

  #page #more {
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
  
  #more button {
    font-family: "Rubik", sans-serif;
    background-color: black;
    color: #BEEEFF;
    border: 2px solid dimgrey;
    font-size: 45px;
    border-radius: 50%;
    height: 100px;
    width: 100px;
    position: absolute;
    bottom: 2dvh;
    right: calc(50% - 50px);
  }
  
  #more button:active {
    border-color: gold;
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