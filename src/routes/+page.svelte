<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        ButtonSet,
        ProgressBar,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    interface PingPong {
        message: string;
    }

    let apiPingSuccess: boolean = false;
    let notification: Notification = {};
    let timeout: any = undefined;

    onMount(() => {
        apiWakeUp();
    });

    async function apiWakeUp() {
        const start = Date.now();
        apiPingSuccess = false;
        let attempts = 0;

        while (!apiPingSuccess) {
            attempts++;
            const response = await apiRequest<ApiResponse<PingPong>>(
                "ping",
                "GET",
            );

            if (response.status === 200) {
                apiPingSuccess = true;
                const end = Date.now();
                const duration = Math.round((end - start) / 1000);
                const message = `A API demorou ${duration} segundos para responder após ${attempts} tentativa(s).`;

                notification = {
                    kind: "success",
                    title: "Sucesso",
                    subtitle: message,
                    caption: new Date().toLocaleString(),
                    timeout: 3_000,
                };
            } else {
                const message = `Tentativa ${attempts} falhou. Tentando novamente em 10 segundos...\n${response.message}`;

                notification = {
                    kind: "error",
                    title: "Erro",
                    subtitle: message,
                    caption: new Date().toLocaleString(),
                    timeout: 3_000,
                };

                await new Promise((resolve) => setTimeout(resolve, 10_000));
            }

            if (!apiPingSuccess) {
                await new Promise((resolve) => setTimeout(resolve, 5_000));
            }
        }
    }
</script>

<div class="flex items-center justify-center !mt-20 w-full">
    <div class="w-1/4">
        <ButtonSet class="flex justify-center !gap-3">
            <Button
                disabled={!apiPingSuccess}
                kind="secondary"
                on:click={() => {
                    goto("/register");
                }}>Registro</Button
            >
            <Button
                disabled={!apiPingSuccess}
                kind="primary"
                on:click={() => {
                    goto("/login");
                }}>Login</Button
            >
        </ButtonSet>
    </div>
</div>

<div
    class="fixed bottom-4 right-4 w-96 transition-opacity duration-300"
    transition:fade
>
    {#if notification.kind}
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
    {/if}

    {#if !apiPingSuccess}
        <ToastNotification
            timeout={notification.timeout}
            kind="info"
            title="Subindo API..."
            caption={new Date().toLocaleString()}
            hideCloseButton={true}
            on:close={(e) => {
                timeout = undefined;
                notification = {};
            }}
        />
        <ProgressBar size="sm" helperText="Api acordando..." class="w-9/12" />
    {/if}
</div>
