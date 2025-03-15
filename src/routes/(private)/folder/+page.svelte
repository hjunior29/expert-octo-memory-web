<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Folder } from "$lib/models/folder";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        Modal,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let folder: Folder = {};
    let folders: Folder[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let openCreateFolderModal: boolean = false;

    onMount(() => {
        getFolders();
    });

    async function createFolder() {
        if (!folder.name) {
            folder.name = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<Folder>>(
            "folders",
            "POST",
            folder,
        );

        if (response.status === 201) {
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
        openCreateFolderModal = false;

        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }

    async function getFolders() {
        const response = await apiRequest<ApiResponse<Folder[]>>(
            "folders",
            "GET",
        );

        if (response.status === 200) {
            folders = response.data || [];
            console.log(folders);
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

<div class="flex justify-end">
    <Button
        on:click={() => {
            openCreateFolderModal = true;
        }}>Criar pasta</Button
    >
</div>
<div></div>

<Modal
    bind:open={openCreateFolderModal}
    modalHeading="Criar Pasta"
    primaryButtonText="Criar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openCreateFolderModal = false)}
    on:open
    on:close
    on:submit={createFolder}
>
    <p>Você irá criar uma pasta para armazenar seus flashcards.</p>
    <br />
    <TextInput
        invalid={folder.name === undefined}
        invalidText="Nome da pasta é obrigatório."
        labelText="Nome da pasta *"
        placeholder="Digite o nome da pasta...."
        bind:value={folder.name}
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
                console.log(e.detail.timeout);
            }}
        />
    </div>
{/if}
