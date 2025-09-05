<script>
  import Controller from '$lib/Controller.svelte';

  let { data } = $props();
</script>

<Controller slug={ data.slug } />
