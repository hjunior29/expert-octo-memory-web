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
        Button,
        Dropdown,
        Modal,
        TextArea,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

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

    let topicId = page.params.topicId;

    onMount(() => {
        getFlashcards();
    });

    async function getFlashcards() {
        const response = await apiRequest<ApiResponse<TopicAndFlashcards>>(
            `topics/${topicId}/flashcards`,
            "GET",
        );

        if (response.status === 200) {
            topic = response.data?.topic || {};
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

    async function editFlashcard() {
        if (!flashcard.title || !flashcard.question || !flashcard.answer) {
            return;
        }

        flashcard = {
            id: flashcard.id,
            title: flashcard.title,
            question: flashcard.question,
            answer: flashcard.answer,
            difficulty: flashcard.difficulty,
        };

        const response = await apiRequest<ApiResponse<Flashcard>>(
            "flashcards/" + flashcard.id,
            "PUT",
            flashcard,
        );

        if (response.status === 200) {
            notification = {
                kind: "success",
                title: "Sucesso",
                subtitle: response.message,
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
        openFlashcardModal = false;

        getFlashcards();
    }

    async function deleteTopic(flashcardId: number) {
        const response = await apiRequest<ApiResponse<Flashcard>>(
            "flashcards/" + flashcardId,
            "DELETE",
        );

        if (response.status === 200) {
            notification = {
                kind: "success",
                title: "Sucesso",
                subtitle: response.message,
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
        openFlashcardModal = false;

        getFlashcards();
    }

    function handleOpenFlashcard(event: CustomEvent) {
        flashcardId = event.detail.flashcardId;
        flashcard = flashcards.find((f) => f.id === flashcardId) || {};
        openFlashcardModal = true;
    }
</script>

<div class="flex justify-end">
    <Button
        on:click={() => {
            goto(topicId + "/study");
        }}>Estudar tópico</Button
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

<Modal
    size="sm"
    bind:open={openFlashcardModal}
    modalHeading="Flashcard"
    primaryButtonText="Salvar"
    secondaryButtonText="Excluir"
    on:click:button--secondary={() => deleteTopic(flashcardId)}
    on:open
    on:close={() => (flashcard = {})}
    on:submit={editFlashcard}
>
    <br />
    <div class="flex flex-col gap-4">
        <TextInput
            invalid={flashcard.title === ""}
            invalidText="Título do flashcard é obrigatório."
            labelText="Título do flashcard *"
            placeholder="Digite o nome do flashcard...."
            bind:value={flashcard.title}
        />

        <TextInput
            invalid={flashcard.question === ""}
            invalidText="Pergunta do flashcard é obrigatória."
            labelText="Pergunta do flashcard *"
            placeholder="Digite a pergunta do flashcard...."
            bind:value={flashcard.question}
        />

        <TextArea
            invalid={flashcard.answer === ""}
            invalidText="Resposta do flashcard é obrigatória."
            labelText="Resposta do flashcard *"
            placeholder="Digite a resposta do flashcard...."
            bind:value={flashcard.answer}
        />

        <Dropdown
            titleText="Dificuldade"
            selectedId={(flashcard.difficulty === "Fácil" && 1) ||
                (flashcard.difficulty === "Médio" && 2) ||
                (flashcard.difficulty === "Difícil" && 3) ||
                undefined}
            label="Selecione a dificuldade"
            items={[
                { id: 1, text: "Fácil" },
                { id: 2, text: "Médio" },
                { id: 3, text: "Difícil" },
            ]}
            on:select={(e) => {
                flashcard.difficulty =
                    (e.detail.selectedId === 1 && "Fácil") ||
                    (e.detail.selectedId === 2 && "Médio") ||
                    (e.detail.selectedId === 3 && "Difícil") ||
                    "";
            }}
        />
    </div>
</Modal>

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
