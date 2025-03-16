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
	let isSideNavOpen: boolean = false;
	let isOpen: boolean = false;
	let url: string = "";

	$: if (typeof window !== "undefined") {
		url = window.location.href;
	}
</script>

{#if url != "/login" && url != "/register"}
	<Header
		persistentHamburgerMenu={true}
		company="EXPERT"
		platformName="Octo Memory"
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
				text="Dashboard"
				on:click={() => goto("/dashboard")}
				class="cursor-pointer"
			/>
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
	<slot />
{/if}
