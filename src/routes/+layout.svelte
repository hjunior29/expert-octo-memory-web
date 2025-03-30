<script lang="ts">
	import "../app.css";
	import "carbon-components-svelte/css/g100.css";
	import {
		Header,
		HeaderUtilities,
		HeaderAction,
		HeaderPanelLinks,
		HeaderPanelDivider,
		HeaderPanelLink,
		SideNav,
		SideNavItems,
		SideNavLink,
		SkipToContent,
		Content,
	} from "carbon-components-svelte";
	import { expoIn } from "svelte/easing";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	let isSideNavOpen: boolean = false;
	let isOpen: boolean = false;
</script>

{#if $page.url.pathname != "/login" && $page.url.pathname != "/register" && $page.url.pathname != "/"}
	<Header
		persistentHamburgerMenu={true}
		company="EXPERT"
		platformName="Octo Memory"
		href="/"
		bind:isSideNavOpen
	>
		<svelte:fragment slot="skip-to-content">
			<SkipToContent />
		</svelte:fragment>
		<HeaderUtilities>
			<HeaderAction
				bind:isOpen
				transition={{ duration: 6000, delay: 500, easing: expoIn }}
			>
				<HeaderPanelLinks>
					<HeaderPanelDivider>Switcher subject 1</HeaderPanelDivider>
					<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
					<HeaderPanelDivider>Switcher subject 2</HeaderPanelDivider>
					<HeaderPanelLink>Switcher item 1</HeaderPanelLink>
					<HeaderPanelLink>Switcher item 2</HeaderPanelLink>
					<HeaderPanelLink>Switcher item 3</HeaderPanelLink>
					<HeaderPanelLink>Switcher item 4</HeaderPanelLink>
					<HeaderPanelLink>Switcher item 5</HeaderPanelLink>
				</HeaderPanelLinks>
			</HeaderAction>
		</HeaderUtilities>
	</Header>

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
