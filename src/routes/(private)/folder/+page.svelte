<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Folder } from "$lib/models/folder";
    import type { Notification } from "$lib/models/notification";
    import {
        Breadcrumb,
        BreadcrumbItem,
        Button,
        Modal,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import FolderIcon from "$lib/components/custom/FolderIcon.svelte";
    import { generateBreadcrumbPaths } from "$lib/utils";

    const pathname =
        typeof window !== "undefined" ? window.location.pathname : "";
    const breadcrumbItems = generateBreadcrumbPaths(pathname);

    let folder: Folder = {};
    let folders: Folder[] = [];
    let notification: Notification = {};
    let timeout: any = undefined;
    let openCreateFolderModal: boolean = false;
    let openEditFolderModal: boolean = false;

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

        getFolders();
    }

    async function getFolders() {
        const response = await apiRequest<ApiResponse<Folder[]>>(
            "folders",
            "GET",
        );

        if (response.status === 200) {
            folders = response.data || [];
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

    async function editFolder() {
        if (!folder.name || !folder.id) {
            folder.name = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<Folder>>(
            "folders",
            "PUT",
            folder,
            folder.id,
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
        openEditFolderModal = false;

        getFolders();
    }

    async function deleteFolder() {
        if (!folder.id) {
            folder.id = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<Folder>>(
            "folders",
            "DELETE",
            folder,
            folder.id,
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

        getFolders();
    }

    function handleEditFolder({
        folderId,
        name,
    }: {
        folderId: string;
        name: string;
    }) {
        folder = { id: Number(folderId), name };
        openEditFolderModal = true;
    }

    function handleDeleteFolder({ folderId }: { folderId: string }) {
        folder = { id: Number(folderId) };
        deleteFolder();
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
            openCreateFolderModal = true;
        }}>Criar nova pasta</Button
    >
</div>
<div class="mt-10">
    <div class="w-full flex flex-wrap gap-8">
        {#each folders as _, i}
            <FolderIcon
                folderId={folders[i].id}
                name={folders[i].name}
                on:edit={(e) => handleEditFolder(e.detail)}
                on:delete={(e) => handleDeleteFolder(e.detail)}
            />
        {/each}
    </div>
</div>

<Modal
    bind:open={openCreateFolderModal}
    modalHeading="Criar Pasta"
    primaryButtonText="Criar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openCreateFolderModal = false)}
    on:open={() => (folder.name = "")}
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

<Modal
    bind:open={openEditFolderModal}
    modalHeading="Editar Pasta"
    primaryButtonText="Salvar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openEditFolderModal = false)}
    on:open
    on:close={() => (folder.id = undefined)}
    on:submit={editFolder}
>
    <p>Você irá editar uma pasta para armazenar seus flashcards.</p>
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
                notification = {};
            }}
        />
    </div>
{/if}
