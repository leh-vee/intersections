<script>
  import { currentPoemId, poemMetadata, poemLines, poemsRead } from '$lib/store.js';
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();

  if ($currentPoemId !== data.docId ) {
    $currentPoemId = data.docId;
    $poemMetadata = { ...$poemMetadata, ...data.poemMetadata };
    $poemLines = data.lines
  }
  $poemsRead = [{ id: $currentPoemId, dateTime: new Date }, ...$poemsRead];
</script>

<ThePage />