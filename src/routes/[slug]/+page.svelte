<script>
  import ThePage from '$lib/ThePage.svelte';

  let { data } = $props();
</script>

<ThePage id={ data.slug } />

