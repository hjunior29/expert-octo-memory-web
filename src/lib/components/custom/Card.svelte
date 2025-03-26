<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        OverflowMenu,
        OverflowMenuItem,
        Tag,
    } from "carbon-components-svelte";
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

<button on:click={() => goto(`/flashcard/${flashcardId}`)} aria-label={title}>
    <div
        class="border rounded shadow-md bg-gray-600 w-72 cursor-pointer p-2 hover:scale-105 transition-transform duration-200"
    >
        <div class="flex flex-col items-start gap-2">
            <span class="!p-4 !text-lg !font-bold">{title}</span>

            <div class="!mr-2 flex flex-row gap-1">
                {#each tags as tag}
                    <Tag type="blue">{tag}</Tag>
                {/each}
            </div>

            <div class="flex flex-col gap-1 !mr-2">
                <Tag type="green">Difficulty: {difficulty}</Tag>
                <Tag type="teal">Review Count: {reviewCount}</Tag>
                <Tag type="warm-gray">Last Reviewed: {formattedDate}</Tag>
            </div>
        </div>

        <div class="flex justify-end">
            <OverflowMenu size="sm" class="rounded-lg">
                <OverflowMenuItem
                    text="Editar"
                    on:click={() => dispatch("edit", { flashcardId, title })}
                />
                <OverflowMenuItem
                    primaryFocus
                    danger
                    text="Deletar"
                    on:click={() => dispatch("delete", { flashcardId })}
                />
            </OverflowMenu>
        </div>
    </div>
</button>
