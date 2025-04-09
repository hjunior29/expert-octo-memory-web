<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/state";
    import { apiRequest } from "$lib/api/utils";
    import Card from "$lib/components/custom/Card.svelte";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import { Flashcard } from "$lib/models/flashcard";
    import type { Notification } from "$lib/models/notification";
    import type { Topic } from "$lib/models/topic";
    import {
        Breadcrumb,
        BreadcrumbItem,
        Button,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { generateBreadcrumbPaths } from "$lib/utils";

    const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
    const breadcrumbItems = generateBreadcrumbPaths(pathname);

    type TopicAndFlashcards = {
        topic: Topic;
        flashcards: Flashcard[];
    };

    let topic: Topic = {};
    let flashcard: Flashcard = {};
    let flashcards: Flashcard[] = [];
    let openFlashcardModal: boolean = false;
    let flashcardId: number = 0;
    let notification: Notification = {};
    let timeout: any = undefined;

    const sharedId = page.params.sharedId;

    onMount(() => {
        getFlashcards();
    });

    async function getFlashcards() {
        const response = await apiRequest<ApiResponse<TopicAndFlashcards>>(
            `topics/shared/${sharedId}`,
            "GET",
        );

        if (response.status === 200) {
            topic = response.data?.topic || {};
            flashcards = response.data?.flashcards || [];
        } else if (response.status === 404) {
            notification = {
                kind: "info",
                title: "Sem flashcards",
                subtitle: "Nenhuma flashcard encontrado.",
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
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

    function handleOpenFlashcard(event: CustomEvent) {
        flashcardId = event.detail.flashcardId;
        flashcard = flashcards.find((f) => f.id === flashcardId) || {};
        openFlashcardModal = true;
    }
</script>

<div class="flex justify-between items-center">
    <Breadcrumb>
        {#each breadcrumbItems as item (item.href)}
            <BreadcrumbItem href={item.href} isCurrentPage={item.isCurrent}>
                {item.label}
            </BreadcrumbItem>
        {/each}
    </Breadcrumb>
    <Button
        on:click={() => {
            goto(`/shared/${sharedId}/study`);
        }}>Estudar tópico compartilhado</Button
    >
</div>

<br />

<div class="mt-10">
    <div class="w-full flex flex-wrap gap-8">
        {#each flashcards as flashcard}
            <Card
                flashcardId={flashcard.id}
                title={flashcard.title}
                tags={flashcard.tags}
                difficulty={flashcard.difficulty}
                lastReviewed={flashcard.lastReviewed}
                reviewCount={flashcard.reviewCount}
                on:open={(e) => handleOpenFlashcard(e)}
            />
        {/each}
    </div>
</div>

{#if notification.kind}
    <div
        class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
        transition:fade
    >
        <ToastNotification
            timeout={notification.timeout}
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            caption={notification.caption}
            on:close={(e) => {
                timeout = undefined;
                notification = {};
            }}
        />
    </div>
{/if}
