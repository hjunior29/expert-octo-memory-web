<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Auth } from "$lib/models/auth";
    import type { Notification } from "$lib/models/notification";
    import type { User } from "$lib/models/user";
    import {
        Button,
        ButtonSet,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    let user: User = {};
    let notification: Notification = {};
    let timeout: any = undefined;

    onMount(() => {
        if (typeof localStorage !== "undefined") {
            const stored = localStorage.getItem("userCredentials");
            if (stored) {
                const creds = JSON.parse(stored);
                user.email = creds.email;
                user.password = creds.password;
            }
        }
    });

    async function login() {
        if (!user.email || !user.password) {
            user.email = undefined;
            user.password = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<Auth>>(
            "auth/login",
            "POST",
            user,
        );

        if (response.status === 200) {
            localStorage.setItem("token", response.data?.token || "");
            goto("/folder");
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

<div class="flex items-center justify-center !mt-20">
    <div class="flex flex-col gap-4">
        <TextInput
            invalid={user.email === undefined}
            invalidText="E-mail é obrigatório."
            labelText="E-mail"
            placeholder="Digite seu e-mail...."
            bind:value={user.email}
        />
        <TextInput
            invalid={user.password === undefined}
            invalidText="Senha é obrigatória."
            labelText="Senha"
            placeholder="Digite sua senha..."
            type="password"
            bind:value={user.password}
        />
        <ButtonSet class="flex w-1/2">
            <Button
                kind="secondary"
                on:click={() => {
                    goto("/register");
                }}>Registrar</Button
            >
            <Button on:click={login}>Login</Button>
        </ButtonSet>
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
