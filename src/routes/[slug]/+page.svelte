<script>
  import Poem from '$lib/Poem.svelte';

  let { data } = $props();
</script>

<Poem id={ data.slug } />
