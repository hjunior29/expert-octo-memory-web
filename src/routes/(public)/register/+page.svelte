<script lang="ts">
    import { apiRequest } from "$lib/api/utils";
    import type { User } from "$lib/models/user";
    import type { Notification } from "$lib/models/notification";
    import { fade } from "svelte/transition";
    import {
        Button,
        ButtonSet,
        TextInput,
        ToastNotification,
    } from "carbon-components-svelte";
    import { goto } from "$app/navigation";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import { formatPhoneNumber } from "$lib/utils";

    let user: User = {};
    let notification: Notification = {};
    let timeout: any = undefined;

    async function register() {
        if (
            !user.firstName ||
            !user.lastName ||
            !user.email ||
            !user.password
        ) {
            user.firstName = undefined;
            user.lastName = undefined;
            user.email = undefined;
            user.password = undefined;
            return;
        }

        const response = await apiRequest<ApiResponse<User>>(
            "auth/register",
            "POST",
            user,
        );

        if (response.status === 201) {
            localStorage.setItem(
                "userCredentials",
                JSON.stringify({
                    email: user.email,
                    password: user.password,
                }),
            );

            notification = {
                kind: "success",
                title: "Sucesso",
                subtitle: response.message,
                caption: new Date().toLocaleString(),
                timeout: 3_000,
            };

            setTimeout(() => {
                goto("/login");
            }, 2000);
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
        <div class="flex justify-between gap-4">
            <TextInput
                invalid={user.firstName === undefined}
                invalidText="Primeiro nome é obrigatório."
                labelText="Primeiro Nome"
                placeholder="Digite seu primeiro nome..."
                bind:value={user.firstName}
            />
            <TextInput
                invalid={user.lastName === undefined}
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
            on:input={() =>
                (user.phoneNumber = formatPhoneNumber(user.phoneNumber || ""))}
        />
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
                    goto("/login");
                }}>Login</Button
            >
            <Button on:click={register}>Registrar</Button>
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
                console.log(e.detail.timeout);
            }}
        />
    </div>
{/if}
