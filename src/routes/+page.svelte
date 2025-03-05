<script>
    import { goto } from "$app/navigation";
    import { Button, ButtonSet } from "carbon-components-svelte";
</script>

<div class="flex items-center justify-center h-screen w-full">
    <div class="w-1/4">
        <ButtonSet class="flex justify-center">
            <Button
                kind="secondary"
                on:click={() => {
                    goto("/register");
                }}>Registro</Button
            >
            <Button>Login</Button>
        </ButtonSet>
    </div>
</div>
