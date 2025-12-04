<script>
  import Title from '$lib/Title.svelte';
  import fitty from 'fitty';
  import { cursorState, isCursorMooning, isCursorTyping, isTheButtonDepressed } from '$lib/store.js';

  let { title, lines, overflowY } = $props();
  
  let nLines = $derived(lines.length);
  let lineEls = $state([]);
  let nLineEls = $derived(lineEls.length);
  let nLineFitEventCalls = $state(0);
  let areLinesFitted = $derived(nLineFitEventCalls === nLineEls && nLineEls > 0);
  let isTextVisible = $state(false);

  let fittyLineEls;
  let isNewLine = $state(false);

  $effect(() => {
    if (nLines === nLineEls) {
      lineEls.forEach((el, i) => el.addEventListener('fit', () => nLineFitEventCalls++));
      fittyLineEls = fitty('.line', { minSize: 8, maxSize: 2000 });
    }
  });

  $effect(() => {
    if (areLinesFitted && !isTextVisible) {
      fittyLineEls.forEach(el => el.freeze());
      addOverflowBuffer();
      isTextVisible = true;
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

  $effect(() => {
    if ($isCursorMooning && $isTheButtonDepressed && nextLineToType < nLineEls) typeLine();
  });

  function typeLine() {
    isNewLine = false;
    $cursorState = 'typing';
    let nextCharToTypeIndex = 1;
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
        $cursorState = false;
        $isTheButtonDepressed = false;
        setTimeout(() => {
          nextLineToType += 1;
          if (nextLineToType < nLineEls) newLineSetup();
        }, Math.PI * 1000);
      }
    }
    typeChar();
  }

  function newLineSetup() {
    stashNextLineText();
    isNewLine = true;
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

  function postLineAnime(event) {
    const animeName = event.animationName.split('-').pop();
    if (animeName === 'emanate') $cursorState = 'mooning';
  }

</script>

<div id='text' style="visibility: {isTextVisible ? 'visible' : 'hidden'}">
  <Title title={ title } on:titled={ newLineSetup } />
  <div id='poem' bind:this={ poemEl }>
    <div id='body' class:cursor={ isTextVisible } class:new={ isNewLine } class:typing={ $isCursorTyping } 
      style:padding-bottom="{ poemOverflowPx }px">
      {#each lines as line, i}
        <span class='line' bind:this={ lineEls[i] } onanimationend={ postLineAnime }
          class:current={ i === nextLineToType }>{ line }</span>
      {/each}
    </div>
  </div>
  <div id='spacer'></div>
</div>

<style>
  #text {
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
  
  #text > div {
    padding: 0;
    width: 100%;
  }
  
  #text #poem {
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    bottom: 1px;
  }

  #text #spacer {
    flex: 1;
  }
  
  #poem #body {
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

  #body.cursor.new .current.line::before, #body.cursor.typing .current.line::after {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 9999px;
    transform-origin: center;
    vertical-align: 0.05em;
  }
  
  #body.cursor.new .current.line::before {
    background: var(--moon-glow-fill);
    box-shadow: 0 0 0.5em var(--moon-glow-stroke);
    animation:
      emanate 3.14s forwards,
      breathe 3.14s ease-in-out infinite 3.14s;
    visibility: visible;
  }

  #body.cursor.typing .current.line::after {
    animation: breathe 3.14s ease-in-out infinite;
    position: relative;
    left: 3px;
    background: gold;
    box-shadow: 0 0 0.5em gold;
  }

  @keyframes emanate {
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