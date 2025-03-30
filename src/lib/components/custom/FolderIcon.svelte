<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        OverflowMenu,
        OverflowMenuItem,
        TooltipIcon,
    } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";

    export let folderId: number = 0;
    export let name: string = "";

    const dispatch = createEventDispatcher();
</script>

<div>
    <button on:click={() => goto(`/folder/${folderId}`)} aria-label={name}>
        <TooltipIcon tooltipText={name}>
            <div
                class="cursor-pointer p-2 rounded hover:scale-105 transition-transform duration-200"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="144"
                    height="144"
                    viewBox="0 0 24 24"
                    ><g
                        fill="none"
                        stroke="#5AC8FA"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        ><path
                            fill="#5AC8FA"
                            d="M12 7h8c0.55 0 1 0.45 1 1v10c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-11Z"
                        /><path d="M12 7h-9v-1c0 -0.55 0.45 -1 1 -1h6z" /></g
                    ></svg
                >
            </div>
        </TooltipIcon>
    </button>
    <div class="text-xs flex gap-4 items-center justify-between w-36">
        <button
            type="button"
            class="cursor-pointer truncate bg-transparent border-none p-0"
            on:click={() => goto(`/folder/${folderId}`)}
            aria-label={name}>{name}</button
        >

        <div class="w-8">
            <OverflowMenu size="sm">
                <OverflowMenuItem
                    text="Editar"
                    on:click={() => dispatch("edit", { folderId, name })}
                />
                <OverflowMenuItem
                    primaryFocus
                    danger
                    text="Deletar"
                    on:click={() => dispatch("delete", { folderId })}
                />
            </OverflowMenu>
        </div>
    </div>
</div>
