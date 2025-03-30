<script lang="ts">
    import { Tag } from "carbon-components-svelte";
    import { createEventDispatcher } from "svelte";

    export let flashcardId: number = 0;
    export let title: string = "";
    export let tags: string[] = [];
    export let difficulty: string = "Medium";
    export let lastReviewed: Date | null = null;
    export let reviewCount: number = 0;

    const dispatch = createEventDispatcher();

    const formattedDate = lastReviewed
        ? new Date(lastReviewed).toLocaleDateString()
        : "Never";
</script>

<div
    class="relative w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 transition-transform hover:scale-[1.03] cursor-pointer"
>
    <button
        on:click={() => dispatch("open", { flashcardId })}
        class="w-full text-left flex flex-col gap-3"
        aria-label={title}
    >
        <h2 class="!p-2 !text-lg font-semibold leading-snug">
            {title}
        </h2>

        <div class="flex flex-wrap gap-2">
            {#each tags as tag}
                <Tag type="blue" class="!text-sm">{tag}</Tag>
            {/each}
        </div>

        <div
            class="!p-2 flex flex-col gap-1 mt-2 text-sm text-gray-700 dark:text-gray-300"
        >
            <div class="flex justify-between">
                <span class="font-medium">Dificuldade:</span>
                <Tag type="green">{difficulty}</Tag>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Revisões:</span>
                <Tag type="teal">{reviewCount || 0}</Tag>
            </div>
            <div class="flex justify-between">
                <span class="font-medium">Última revisão:</span>
                <Tag type="warm-gray">{formattedDate}</Tag>
            </div>
        </div>
    </button>
</div>
