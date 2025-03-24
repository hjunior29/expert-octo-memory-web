<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        Modal,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { Topic } from "$lib/models/topic";
    import type { Folder } from "$lib/models/folder";
    import { page } from "$app/state";
    import FlashcardIcon from "$lib/components/custom/FlashcardIcon.svelte";

    type TopicAndFlashcards = {
        folder: Folder;
        topics: Topic[];
    };

    let folder: Folder = {};
    let topic: Topic = {};
    let topics: Topic[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let openEditTopicModal: boolean = false;

    let folderId = page.params.folderId;

    onMount(() => {
        getTopics();
    });

    async function getTopics() {
        const response = await apiRequest<ApiResponse<TopicAndFlashcards>>(
            "folders/" + folderId + "/topics",
            "GET",
        );

        if (response.status === 200) {
            folder = response.data?.folder || {};
            topics = response.data?.topics || [];
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

    async function editTopic() {
        if (!topic.name || !topic.id) {
            topic.name = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<Topic>>(
            "topics/" + topic.id,
            "PUT",
            topic,
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
        openEditTopicModal = false;

        getTopics();
    }

    async function deleteTopic(topicId: number) {
        const response = await apiRequest<ApiResponse<Topic>>(
            "topics/" + topicId,
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

        getTopics();
    }

    function handleEditTopic({
        topicId,
        name,
    }: {
        topicId: string;
        name: string;
    }) {
        folder = { id: Number(topicId), name };
        openEditTopicModal = true;
    }

    function handleDeleteTopic({ topicId }: { topicId: number }) {
        topic = { id: topicId };
        deleteTopic(topicId);
    }
</script>

<div class="flex justify-end">
    <Button
        on:click={() => {
            openEditTopicModal = true;
        }}>Criar nova pasta</Button
    >
</div>
<div class="mt-10">
    <div class="w-full flex flex-wrap gap-8">
        {#each topics as _, i}
            <FlashcardIcon
                folderId={folder.id!}
                topicId={topics[i].id}
                name={topics[i].name}
                on:edit={(e) => handleEditTopic(e.detail)}
                on:delete={(e) => handleDeleteTopic(e.detail)}
            />
        {/each}
    </div>
</div>

<Modal
    bind:open={openEditTopicModal}
    modalHeading="Editar Tópico"
    primaryButtonText="Salvar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openEditTopicModal = false)}
    on:open
    on:close={() => (topic.id = undefined)}
    on:submit={editTopic}
>
    <p>Você irá editar tópico para armazenar seus flashcards.</p>
    <br />
    <TextInput
        invalid={topic.name === undefined}
        invalidText="Nome do tópico é obrigatório."
        labelText="Nome do tópico *"
        placeholder="Digite o nome do tópico...."
        bind:value={topic.name}
    />
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
