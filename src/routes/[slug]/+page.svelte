<script>
  import IndexCard from '$lib/IndexCard.svelte';

  let { data } = $props();
</script>

<IndexCard slug={ data.slug } />
