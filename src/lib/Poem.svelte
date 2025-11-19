<script>
  import Title from '$lib/Title.svelte';
  import fitty from 'fitty';

  let { title, lines, overflowY, typeNextLine } = $props();
  
  let nLines = $derived(lines.length);
  let lineEls = $state([]);
  let nLineEls = $derived(lineEls.length);
  let nLineFitEventCalls = $state(0);
  let areLinesFitted = $derived(nLineFitEventCalls === nLineEls && nLineEls > 0);
  let isTextVisible = $state(false);

  let fittyLineEls;

  $effect(() => {
    if (nLines === nLineEls) {
      lineEls.forEach((el, i) => el.addEventListener('fit', () => nLineFitEventCalls++));
      fittyLineEls = fitty('#poem #text .line', { minSize: 8, maxSize: 2000 });
    }
  });

  $effect(() => {
    if (areLinesFitted && !isTextVisible) {
      fittyLineEls.forEach(el => el.freeze());
      isTextVisible = true;
      addOverflowBuffer();
    }
	});

  let isTyping = $state(false);
  let nextLineToType = $state(0);

  $effect(() => {
    if (typeNextLine && nextLineToType < nLineEls && !isTyping) typeLine();
  });


  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function typeLine() {
    isTyping = true;
    const lineEl = lineEls[nextLineToType];
    const elTextContent = lineEl.textContent;
    const text = elTextContent;
    let nextCharIndex = 1;
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

  let poemEl;
  let poemOverflowPx = $state(0);

  function addOverflowBuffer() {
    const poemRect = poemEl.getBoundingClientRect();
    const poemBtmPx = poemRect.bottom 
    const windowHeight = window.innerHeight;
    if (poemBtmPx > overflowY) {
      // text overflows a) button only b) full screen 
      poemOverflowPx = Math.ceil(
        Math.min(((poemBtmPx - overflowY) * 2), windowHeight - overflowY)
      );
      poemOverflowPx += 5; // add 5px margin
    } 
  }

  let cursor = $state(false);
</script>

<div id='the-text' style="visibility: {isTextVisible ? 'visible' : 'hidden'}">
  <Title title={ title } on:titled={ ()=> { cursor = true } } />
  <div id='poem' bind:this={ poemEl }>
    <div id='text' class:cursor style:padding-bottom="{ poemOverflowPx }px">
      {#each lines as line, i}
        <span class='line' bind:this={ lineEls[i] }
          class:next={ i === nextLineToType && !isTyping } >{ line }</span>
      {/each}
    </div>
  </div>
  <div id='spacer'></div>
</div>

<style>
  #the-text {
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
  
  #the-text > div {
    padding: 0;
    width: 100%;
  }
  
  #the-text #poem {
    overflow-y: scroll;
    position: relative;
    bottom: 2px;
  }

  #the-text #spacer {
    flex: 1;
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
  
 .cursor .line.next::before {
    content: '';
    display: inline-block;
    width: 0.5em;   /* scales with font-size from fitty */
    height: 0.5em;
    border-radius: 9999px;
    transform-origin: center;
    background: gold;
    animation:
      emenate 3s forwards,
      breathe 3.14s ease-in-out infinite 3s;
    vertical-align: 0.05em;
    box-shadow: 0 0 0.2em rgba(255, 215, 0, 0.8);
    visibility: visible;
  }

  @keyframes emenate {
    0%   { 
      transform: scale(0); 
      opacity: 0; 
    }
    100% { 
      transform: scale(0.7); 
      opacity: 1;
    }
  }

  @keyframes breathe {
    0%   { 
      transform: scale(0.7); 
      opacity: 1;
    }
    50%  { 
      transform: scale(1); 
      opacity: 0.8; 
    }
    100% { 
      transform: scale(0.7); 
      opacity: 1; 
    }
  }
</style>