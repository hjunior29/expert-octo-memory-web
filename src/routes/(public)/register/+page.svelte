<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { User } from "$lib/models/user";
    import type { Notification } from "$lib/models/notification";
    import { fade } from "svelte/transition";
    import {
        Button,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { goto } from "$app/navigation";

    let user: User = {};
    let notification: Notification = {};
    let timeout: any = undefined;

    async function register() {
        try {
            const createdUser = await apiRequest<User>("users", "POST", user);
            console.log("Usuário registrado:", createdUser);
        } catch (error) {
            console.error("Erro ao registrar usuário", error);
            notification = {
                kind: "error",
                title: "Erro",
                subtitle: "Erro ao registrar usuário.",
                caption: new Date().toLocaleString(),
            };
            timeout = 3_000;
            showNotification = true;
        }

        notification = {
            kind: "success",
            title: "Sucesso",
            subtitle: "Usuário registrado com sucesso.",
            caption: new Date().toLocaleString(),
        };
        timeout = 3_000;
        showNotification = true;

        setTimeout(() => {
            goto("/login");
        }, 3000);
    }

    $: showNotification = timeout !== undefined;
</script>

<div class="flex items-center justify-center h-screen w-full">
    <div class="w-1/4 flex flex-col gap-4">
        <div class="flex justify-between gap-4">
            <TextInput
                invalid={user.firstName === ""}
                invalidText="Primeiro nome é obrigatório."
                labelText="Primeiro Nome"
                placeholder="Digite seu primeiro nome..."
                bind:value={user.firstName}
            />
            <TextInput
                invalid={user.lastName === ""}
                invalidText="Último nome é obrigatório."
                labelText="Último Nome"
                placeholder="Digite seu último nome..."
                bind:value={user.lastName}
            />
        </div>
        <TextInput
            helperText="Número de telefone é opcional"
            labelText="Número de telefone"
            placeholder="Digite seu número aqui..."
            bind:value={user.phoneNumber}
        />
        <TextInput
            invalid={user.email === ""}
            invalidText="E-mail é obrigatório."
            labelText="E-mail"
            placeholder="Digite seu e-mail...."
            bind:value={user.email}
        />
        <TextInput
            invalid={user.password === ""}
            invalidText="Senha é obrigatória."
            labelText="Senha"
            placeholder="Digite sua senha..."
            type="password"
            bind:value={user.password}
        />
        <div class="w-full">
            <Button on:click={register}>Registrar</Button>
        </div>
    </div>
</div>

{#if showNotification}
    <div
        class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
        transition:fade
    >
        <ToastNotification
            {timeout}
            fullWidth
            kind="success"
            title="Sucesso"
            subtitle="Usuário registrado com sucesso."
            caption={new Date().toLocaleString()}
            on:close={(e) => {
                timeout = undefined;
                console.log(e.detail.timeout);
            }}
        />
    </div>
{/if}
