<script>
  import { currentPoemId, poemMetadata, poemLines, 
    poemIndex, poemsRead } from '$lib/store.js';
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();

  if ($currentPoemId !== data.docId ) {
    $currentPoemId = data.docId;
    const indexMetadata = $poemIndex[$currentPoemId];
    $poemMetadata = { ...indexMetadata, ...data.poemMetadata };
    $poemLines = data.lines
  }
  $poemsRead = [{ id: $currentPoemId, dateTime: new Date }, ...$poemsRead];
</script>

<ThePage />