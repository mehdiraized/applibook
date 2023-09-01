<script>
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink
	} from 'carbon-components-svelte';

	let isOpen = false;

	import 'carbon-components-svelte/css/all.css';
	import Developer from './Components/Developer.svelte';
	import Library from './Library.svelte';
	import People from './People.svelte';
	// import '/global.css';

	let theme = 'white', // "white" | "g10" | "g80" | "g90" | "g100"
		// showPage = 'people',
		showPage = 'library',
		openDeveloper = false;

	$: document.documentElement.setAttribute('theme', theme);
</script>

<Header company="لیست" platformName={showPage === 'library' ? 'کتاب ها' : 'کتاب گیرنده ها'}>
	<HeaderUtilities>
		<HeaderAction
			bind:isOpen
			transition={{
				text: 'Default (duration: 200ms)',
				value: { duration: 200 }
			}}
		>
			<HeaderPanelLinks>
				<HeaderPanelLink
					on:click={() => {
						showPage = 'library';
						isOpen = false;
					}}
				>
					لیست کتاب ها
				</HeaderPanelLink>
				<HeaderPanelLink
					on:click={() => {
						showPage = 'people';
						isOpen = false;
					}}
				>
					لیست کتاب گیرنده ها
				</HeaderPanelLink>
				<HeaderPanelDivider />
				<HeaderPanelLink
					on:click={() => {
						openDeveloper = true;
						isOpen = false;
					}}
				>
					درباره سازنده
				</HeaderPanelLink>
			</HeaderPanelLinks>
		</HeaderAction>
	</HeaderUtilities>
</Header>
<main class="main">
	{#if showPage === 'library'}
		<Library />
	{:else if showPage === 'people'}
		<People />
	{/if}
</main>
{#if openDeveloper}
	<Developer bind:open={openDeveloper} />
{/if}

<style>
	.main {
		padding-top: 48px;
		display: flex;
		height: auto;
		width: 100%;
	}
</style>
