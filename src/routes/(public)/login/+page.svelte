<script lang="ts">
    import { goto } from "$app/navigation";
    import type { User } from "$lib/models/user";
    import { Button, TextInput } from "carbon-components-svelte";

    let user: User = {};

    function login() {
        goto("/dashboard");
    }
</script>

<div class="flex items-center justify-center h-screen w-full">
    <div class="w-1/4 flex flex-col gap-4">
        <TextInput
            labelText="E-mail"
            placeholder="Digite seu e-mail...."
            bind:value={user.email}
        />
        <TextInput
            labelText="Senha"
            placeholder="Digite sua senha..."
            type="password"
            bind:value={user.password}
        />
        <div class="w-full">
            <Button on:click={login}>Login</Button>
        </div>
    </div>
</div>
