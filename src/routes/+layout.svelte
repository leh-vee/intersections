<script>
	import { poemIndex } from '$lib/store.js';
	import '../app.css';

	let { data, children } = $props();

	$poemIndex = data.parsedIndex; 
</script>

{@render children()}
