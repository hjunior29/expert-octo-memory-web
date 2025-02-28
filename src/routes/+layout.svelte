<script lang="ts">
	import "../app.css";
	import "carbon-components-svelte/css/g100.css";

	let { children } = $props();
</script>

{@render children()}
