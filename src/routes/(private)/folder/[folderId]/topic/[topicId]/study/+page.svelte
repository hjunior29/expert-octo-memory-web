<script lang="ts">
    import { onMount } from "svelte";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Flashcard } from "$lib/models/flashcard";
    import type { Topic } from "$lib/models/topic";
    import { page } from "$app/state";
    import { Button, Loading } from "carbon-components-svelte";
    import type { Notification } from "$lib/models/notification";
    import { goto } from "$app/navigation";

    type TopicAndFlashcards = {
        topic: Topic;
        flashcards: Flashcard[];
    };

    let flashcards: Flashcard[] = [];
    let topic: Topic = {};
    let notification: Notification = {};
    let timeout: any = undefined;
    let currentIndex = 0;
    let isFlipped = false;
    let isLastCard = false;

    const topicId = page.params.topicId;

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

    function nextCard() {
        if (currentIndex < flashcards.length - 1) {
            currentIndex++;
            isFlipped = false;
        }

        if (currentIndex === flashcards.length - 1) {
            isLastCard = true;
        } else {
            isLastCard = false;
        }
    }

    function previousCard() {
        if (currentIndex > 0) {
            currentIndex--;
            isFlipped = false;
        }

        if (currentIndex === flashcards.length - 1) {
            isLastCard = true;
        } else {
            isLastCard = false;
        }
    }

    function flipCard() {
        isFlipped = !isFlipped;
    }
</script>

<div class="flex justify-end">
    <Button
        kind="danger"
        on:click={() => {
            window.history.back();
        }}>Parar</Button
    >
</div>

<br />

{#if flashcards.length > 0}
    <div class="flex flex-col items-center justify-center px-4">
        <div
            class="!w-full !max-w-4xl !h-[550px] card-container !p-6 rounded-xl bg-gray-900 text-white shadow-lg flex flex-col justify-between"
        >
            <div
                class="flex-1 flex justify-center items-center"
                on:click={flipCard}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === "Enter" && flipCard()}
            >
                <div class="relative w-full h-full card">
                    <div class="card-inner {isFlipped ? 'flipped' : ''}">
                        <div class="card-front flex flex-col h-full">
                            <h2 class="!text-3xl !font-bold text-center !mt-4">
                                {flashcards[currentIndex].title}
                            </h2>
                            <div
                                class="flex-grow flex items-center justify-center"
                            >
                                <p class="text-lg text-center">
                                    {flashcards[currentIndex].question}
                                </p>
                            </div>
                        </div>
                        <div class="card-back flex flex-col h-full">
                            <h2 class="!text-3xl !font-bold text-center !mt-4">
                                Resposta
                            </h2>
                            <div
                                class="flex-grow flex items-center justify-start pl-1/2"
                            >
                                <p class="text-lg">
                                    {flashcards[currentIndex].answer}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-between !mt-20">
                <Button
                    kind="secondary"
                    disabled={currentIndex === 0}
                    on:click={previousCard}
                >
                    Anterior
                </Button>
                {#if isLastCard}
                    <Button
                        kind="tertiary"
                        on:click={() => {
                            window.history.back();
                        }}
                    >
                        Concluír
                    </Button>
                {:else}
                    <Button kind="primary" on:click={nextCard}>Próximo</Button>
                {/if}
            </div>
        </div>
    </div>
{:else}
    <p class="text-center mt-10 text-white">
        <Loading />
    </p>
{/if}

<style>
    .card {
        perspective: 1200px;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .card-inner {
        transition: transform 0.6s;
        transform-style: preserve-3d;
        position: relative;
        width: 100%;
        height: 100%;
    }

    .flipped {
        transform: rotateY(180deg);
    }

    .card-front,
    .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 1rem;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .card-front {
        background-color: #1f2937;
        color: white;
    }

    .card-back {
        background-color: #568759;
        color: white;
        transform: rotateY(180deg);
    }

    .card-container {
        transition: all 0.3s ease-in-out;
    }

    .card-container:hover {
        box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
    }
</style>
