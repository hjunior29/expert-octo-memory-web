<script lang="ts">
    import flashcardIcon from "./flashcard.png";
    import { goto } from "$app/navigation";
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";

    export let folderId: number = 0;
    export let topicId: number = 0;
    export let name: string = "";

    const dispatch = createEventDispatcher();
</script>

<div>
    <button
        on:click={() => goto(`/folder/${folderId}/topic/${topicId}`)}
        aria-label={name}
    >
        <div
            class="cursor-pointer p-2 rounded hover:scale-105 transition-transform duration-200"
        >
            <img src={flashcardIcon} alt="Flashcard" />
        </div>
    </button>
    <div class="text-xs flex gap-4 items-center justify-between w-36">
        <button
            type="button"
            class="cursor-pointer truncate bg-transparent border-none p-0"
            on:click={() => goto(`/folder/${folderId}/topic/${topicId}`)}
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
