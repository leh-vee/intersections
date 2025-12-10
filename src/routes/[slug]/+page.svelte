<script>
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();
</script>

{#key data.slug}
  <ThePage id={ data.slug } />
{/key}
