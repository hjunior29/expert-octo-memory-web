<script lang="ts">
    import { page } from "$app/stores";
    import { apiRequest } from "$lib/api/utils";
    import FlashcardIcon from "$lib/components/custom/FlashcardIcon.svelte";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Flashcard } from "$lib/models/flashcard";
    import type { Folder } from "$lib/models/folder";
    import type { Notification } from "$lib/models/notification";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    type FolderAndFlashcards = {
        folder: Folder;
        flashcards: Flashcard[];
    };

    const id = get(page).params.id;

    let folder: Folder = {};
    let flashcards: Flashcard[] = [];
    let notification: Notification = {};

    onMount(() => {
        getFolder();
    });

    async function getFolder() {
        const response = await apiRequest<ApiResponse<FolderAndFlashcards>>(
            "folders/" + id + "/flashcards",
            "GET",
        );

        if (response.status === 200) {
            folder = response.data?.folder || {};
            flashcards = response.data?.flashcards || [];
        } else {
            notification = {
                kind: "error",
                title: "Erro",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
        }
    }
</script>

<div class="flashcards">
    {#each flashcards as flashcard}
        <FlashcardIcon
            id={flashcard.id!}
            title={flashcard.title!}
            createdAt={flashcard.createdAt!}
        />
    {/each}
</div>
