<script lang="ts">
    import Card from "$lib/components/custom/Card.svelte";

    const flashcards = [
        {
            flashcardId: 1,
            title: "O que é programação?",
            tags: ["cwcewc", "dwedwe", "cwecwe"],
            difficulty: "Easy",
            lastReviewed: new Date(),
            reviewCount: 5,
        },
        {
            flashcardId: 2,
            title: "Princípios da POO",
            tags: ["cwcewc", "dwedwe", "cwecwe"],
            difficulty: "Medium",
            lastReviewed: new Date("2024-01-15"),
            reviewCount: 10,
        },
        {
            flashcardId: 3,
            title: "Estruturas de Dados",
            tags: ["cwcewc", "dwedwe", "cwecwe"],
            difficulty: "Hard",
            lastReviewed: null,
            reviewCount: 0,
        },
    ];
</script>

<span class="p-4 text-3xl font-bold truncate">dekme</span>
<span class="!p-4 !text-3xl font-bold truncate">title</span>

<div class="mt-10">
    <div class="w-full flex flex-wrap gap-8">
        {#each flashcards as flashcard}
            <Card
                flashcardId={flashcard.flashcardId}
                title={flashcard.title}
                tags={flashcard.tags}
                difficulty={flashcard.difficulty}
                lastReviewed={flashcard.lastReviewed}
                reviewCount={flashcard.reviewCount}
            />
        {/each}
    </div>
</div>
