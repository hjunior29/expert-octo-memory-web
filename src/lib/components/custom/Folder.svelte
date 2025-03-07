<script>
    import { goto } from "$app/navigation";
    export let url;
    export let name;
</script>

<button on:click={() => goto(url)}>
    <div class="cursor-pointer">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="144"
            height="144"
            viewBox="0 0 24 24"
            ><g
                fill="none"
                stroke="#5AC8FA"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                ><path
                    fill="#5AC8FA"
                    d="M12 7h8c0.55 0 1 0.45 1 1v10c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-11Z"
                /><path d="M12 7h-9v-1c0 -0.55 0.45 -1 1 -1h6z" /></g
            ></svg
        >
        <p>{name}</p>
    </div>
</button>
