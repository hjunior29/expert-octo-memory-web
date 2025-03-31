<script lang="ts">
	import "../app.css";
	import "carbon-components-svelte/css/g100.css";
	import {
		Header,
		SideNav,
		SideNavItems,
		SideNavLink,
		Content,
	} from "carbon-components-svelte";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";

	let isSideNavOpen: boolean = false;
	let title: string = "OCTO 🚀";

	$: path = $page.url.pathname;
	$: if (browser) {
		switch (true) {
			case path === "/":
				title = "OCTO 🚀";
				break;
			case path === "/login":
				title = "Login | OCTO 🚀";
				break;
			case path === "/register":
				title = "Registro | OCTO 🚀";
				break;
			case path === "/folder":
				title = "Pastas | OCTO 🚀";
				break;
			case path.includes("/folder/") && !path.includes("/topic/"):
				title = "Tópicos | OCTO 🚀";
				break;
			case path.includes("/topic/") &&
				!path.includes("/flashcard/") &&
				!path.includes("/study"):
				title = "Flashcards | OCTO 🚀";
				break;
			case path.includes("/study"):
				title = "Estudo | OCTO 🚀";
				break;
			default:
				title = "OCTO 🚀";
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if $page.url.pathname != "/login" && $page.url.pathname != "/register" && $page.url.pathname != "/"}
	<Header
		persistentHamburgerMenu={true}
		company="EXPERT"
		platformName="Octo Memory"
		href="/"
		bind:isSideNavOpen
	></Header>
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			<SideNavLink
				text="Pastas"
				on:click={() => goto("/folder")}
				class="cursor-pointer"
			/>
		</SideNavItems>
	</SideNav>
	<Content>
		<slot />
	</Content>
{:else}
	<Header company="EXPERT" platformName="Octo Memory" href="/"></Header>
	<Content>
		<slot />
	</Content>
{/if}
