<script>
  import Title from '$lib/Title.svelte';
  import fitty from 'fitty';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

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
      stashNextLineText();
      addOverflowBuffer();
    }
	});

  let nextLineToType = $state(0);
  let lineEl = $derived(lineEls[nextLineToType]);

  let stashedText;
  function stashNextLineText() {
    if (lineEl !== undefined) {
      stashedText = lineEl.textContent;
      lineEl.textContent = '_';
    }
  }

  let isTyping = $state(false);
  let isCursorVisible = $state(false);

  $effect(() => {
    if (typeNextLine && nextLineToType < nLineEls && !isTyping) typeLine();
  });

  let nextCharToTypeIndex = $state(1);
  let percentOfLineTyped = $derived(nextCharToTypeIndex / stashedText.length);
  let isLastLetterTyped = $derived(percentOfLineTyped >= 1);

  function typeLine() {
    isTyping = true;
    const typeChar = () => {
      lineEl.textContent = stashedText.slice(0, nextCharToTypeIndex);
      const char = stashedText.slice(nextCharToTypeIndex - 1, nextCharToTypeIndex);
      if (nextCharToTypeIndex < stashedText.length) {
        if (nextCharToTypeIndex === 1) lineEl.style.visibility = 'visible';
        nextCharToTypeIndex += 1;
        let typingDelay = randomInt(100, 200);
        if (/[.,;:!?[\]{}\–—]/.test(char)) typingDelay = randomInt(1000, Math.PI * 1000);
        setTimeout(typeChar, typingDelay);
      } else {
        isTyping = false;
        nextLineToType += 1;
        if (nextLineToType < nLineEls) {
          dispatch('line');
        }
        stashNextLineText();
        nextCharToTypeIndex = 1;
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

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function showCursor() {
    dispatch('line');
    isCursorVisible = true;
  }
</script>

<div id='the-text' style="visibility: {isTextVisible ? 'visible' : 'hidden'}">
  <Title title={ title } on:titled={ showCursor } />
  <div id='poem' bind:this={ poemEl }>
    <div id='text' class:cursor={ isCursorVisible } style:padding-bottom="{ poemOverflowPx }px">
      {#each lines as line, i}
        <span class='line' bind:this={ lineEls[i] }
          class:next={ i === nextLineToType && !isTyping }
          class:typing={ i === nextLineToType && isTyping && !isLastLetterTyped } >{ line }</span>
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
    overflow-x: hidden;
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

  .cursor .line.next::before, .cursor .line.typing::after {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 9999px;
    transform-origin: center;
    vertical-align: 0.05em;
    background: var(--moon-glow-fill);
    box-shadow: 0 0 0.5em var(--moon-glow-stroke);
  }
  
 .cursor .line.next::before {
    animation:
      emenate 3.14s forwards,
      breathe 3.14s ease-in-out infinite 3.14s;
    visibility: visible;
  }

  .cursor .line.typing::after {
    animation: breathe 3.14s ease-in-out infinite;
    position: relative;
    left: 3px;
    background: gold;
    box-shadow: 0 0 0.5em gold;
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