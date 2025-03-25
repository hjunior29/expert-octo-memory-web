<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        FileUploader,
        Modal,
        ProgressBar,
        Tab,
        TabContent,
        Tabs,
        TextArea,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import type { Topic } from "$lib/models/topic";
    import type { Folder } from "$lib/models/folder";
    import { page } from "$app/state";
    import FlashcardIcon from "$lib/components/custom/FlashcardIcon.svelte";
    import { AiGenerate } from "carbon-icons-svelte";
    import type { Flashcard, FlashcardGenerate } from "$lib/models/flashcard";
    import { fileToBase64 } from "$lib/utils";

    type TopicAndFlashcards = {
        folder: Folder;
        topics: Topic[];
    };

    let folder: Folder = {};
    let topic: Topic = {};
    let topics: Topic[] = [];
    let flashcardGenerate: FlashcardGenerate = {};
    let fileUploader;
    let files: File[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let openGenerateFlashcardsModal: boolean = false;
    let openEditTopicModal: boolean = false;
    let isGeneratingFlashcards: boolean = false;

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

    async function generateFlashcards() {
        let dataType: string = "";

        if (flashcardGenerate.text) {
            dataType = "text";
        } else if (flashcardGenerate.link) {
            dataType = "link";
        } else if (flashcardGenerate.topic) {
            dataType = "topic";
        } else if (files.length > 0) {
            dataType = "file";
        }

        openGenerateFlashcardsModal = false;
        isGeneratingFlashcards = true;

        const response = await apiRequest<ApiResponse<Flashcard[]>>(
            "flashcards/generate/" + dataType + "/" + folderId,
            "POST",
            flashcardGenerate,
        );

        if (response.status === 201) {
            isGeneratingFlashcards = false;
            notification = {
                kind: "success",
                title: "Sucesso",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };
        } else {
            isGeneratingFlashcards = false;
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

    function handleEditTopic(updatedTopic: { topicId: number; name: string }) {
        topic = { id: updatedTopic.topicId, name: updatedTopic.name };
        openEditTopicModal = true;
    }

    function handleDeleteTopic({ topicId }: { topicId: number }) {
        topic = { id: topicId };
        deleteTopic(topicId);
    }

    async function handleFileUpload() {
        if (!files.length) return;
        flashcardGenerate.files = await Promise.all(
            files.map(async (file) => ({
                name: file.name,
                base64: await fileToBase64(file),
            })),
        );
    }
</script>

<div class="flex justify-end">
    <Button
        icon={AiGenerate}
        on:click={() => {
            openGenerateFlashcardsModal = true;
        }}>Gerar Flashcards</Button
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
    bind:open={openGenerateFlashcardsModal}
    modalHeading="Gerar Flashcards"
    primaryButtonIcon={AiGenerate}
    primaryButtonText="Gerar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openGenerateFlashcardsModal = false)}
    on:open
    on:close
    on:submit={generateFlashcards}
>
    <p>
        Você pode gerar flashcards a partir de links de sites, vídeos do
        YouTube, vídeos enviados à plataforma ou apenas descrevendo o assunto
        que deseja.
    </p>
    <br />
    <Tabs type="container">
        <Tab label="Texto" />
        <Tab label="Link" />
        <Tab label="Assunto" />
        <Tab label="Arquivo" />
        <svelte:fragment slot="content">
            <TabContent>
                <div>
                    <p>Cole o texto de um determinado assunto.</p>
                </div>
                <TextArea
                    invalidText="Texto é obrigatório."
                    labelText="Texto *"
                    placeholder="Cole o texto..."
                    bind:value={flashcardGenerate.text}
                />
            </TabContent>
            <TabContent>
                <div>
                    <p>Cole o link de um site ou vídeo.</p>
                </div>
                <TextInput
                    invalidText="Link é obrigatório."
                    labelText="Link *"
                    placeholder="Cole o link..."
                    bind:value={flashcardGenerate.link}
                />
            </TabContent>
            <TabContent>
                <div>
                    <p>Escreva sobre o assunto.</p>
                </div>
                <TextInput
                    invalidText="Texto é obrigatório."
                    labelText="Texto"
                    placeholder="Escreva sobre o assunto..."
                    bind:value={flashcardGenerate.topic}
                />
            </TabContent>
            <TabContent>
                <div>
                    <p>Envie um PDF, imagem, DOCX ou áudio MP3.</p>
                </div>
                <FileUploader
                    bind:this={fileUploader}
                    labelTitle="Upload file"
                    buttonLabel="Adicionar arquivo"
                    labelDescription="Clique para adicionar"
                    accept={[".pdf", ".docx", ".jpg", ".jpeg", ".png", ".mp3"]}
                    status="complete"
                    bind:files
                    on:add={handleFileUpload}
                />
                {#if files.length > 0}
                    <br />
                    <Button
                        size="small"
                        kind="tertiary"
                        disabled={!files.length}
                        on:click={fileUploader.clearFiles}
                    >
                        Limpar
                    </Button>
                {/if}
            </TabContent>
        </svelte:fragment>
    </Tabs>
</Modal>

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

{#if isGeneratingFlashcards}
    <div
        class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
        transition:fade
    >
        <ToastNotification
            timeout={notification.timeout}
            kind="info"
            title="Gerando Flashcards..."
            caption={new Date().toLocaleString()}
            hideCloseButton={true}
            on:close={(e) => {
                timeout = undefined;
                notification = {};
            }}
        />
        <ProgressBar size="sm" helperText="Gerando..." class="w-11/12" />
    </div>
{/if}
