<script>
  import { currentPoemId, poemsRead } from '$lib/store.js';
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();

  if ($currentPoemId !== data.slug ) $currentPoemId = data.slug;
  $poemsRead = [{ id: $currentPoemId, dateTime: new Date }, ...$poemsRead];
</script>

<ThePage />

