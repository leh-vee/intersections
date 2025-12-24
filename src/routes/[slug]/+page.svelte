<script>
  import { currentPoemId } from '$lib/store.js';
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();

  if ($currentPoemId !== data.slug ) {
    $currentPoemId = data.slug;
  }
</script>

<ThePage />

