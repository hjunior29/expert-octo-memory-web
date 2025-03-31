<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import { Button, ButtonSet } from "carbon-components-svelte";
    import { onMount } from "svelte";

    interface PingPong {
        message: string;
    }

    onMount(() => {
        apiWakeUp();
    });

    async function apiWakeUp() {
        const start = Date.now();
        let success = false;
        let attempts = 0;

        console.log("Aguardando a API acordar...");

        while (!success) {
            attempts++;
            const response = await apiRequest<ApiResponse<PingPong>>(
                "ping",
                "GET",
            );

            if (response.status === 200) {
                success = true;
                const end = Date.now();
                const duration = Math.round((end - start) / 1000);
                console.log(
                    `✅ A API demorou ${duration} segundos para responder após ${attempts} tentativa(s).\n`,
                    response.message,
                );
            } else {
                console.log(
                    `⚠️ Tentativa ${attempts} falhou. Tentando novamente em 10 segundos...\n`,
                    response.message,
                );

                await new Promise((resolve) => setTimeout(resolve, 10_000));
            }

            if (!success) {
                await new Promise((resolve) => setTimeout(resolve, 5_000));
            }
        }
    }
</script>

<div class="flex items-center justify-center !mt-20 w-full">
    <div class="w-1/4">
        <ButtonSet class="flex justify-center !gap-3">
            <Button
                kind="secondary"
                on:click={() => {
                    goto("/register");
                }}>Registro</Button
            >
            <Button
                kind="primary"
                on:click={() => {
                    goto("/login");
                }}>Login</Button
            >
        </ButtonSet>
    </div>
</div>
