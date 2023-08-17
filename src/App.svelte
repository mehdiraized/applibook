<script>
	import Dashboard from './Dashboard.svelte';
	import 'carbon-components-svelte/css/all.css';
	// import '/global.css';

	let theme = 'white'; // "white" | "g10" | "g80" | "g90" | "g100"

	$: document.documentElement.setAttribute('theme', theme);
</script>

<main>
	<Dashboard />
</main>

<style>
	main {
		display: flex;
		height: auto;
		width: 100%;
	}
</style>
