<script>
  import { currentPoemId, poemMetadata, poemsRead } from '$lib/store.js';
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();

  if ($currentPoemId !== data.docId ) {
    $currentPoemId = data.docId;
    $poemMetadata = data.poemMetadata;
  }
  $poemsRead = [{ id: $currentPoemId, dateTime: new Date }, ...$poemsRead];
</script>

<ThePage />