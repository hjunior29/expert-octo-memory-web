<script lang="ts">
    import Folder from "$lib/components/custom/Folder.svelte";

    let numberOfFolders = 5;
    let folders = Array(numberOfFolders).fill(null);
</script>

<div class="">
    <div class="w-full flex flex-wrap gap-4">
        {#each folders as _, i}
            <Folder url={`folder-${i}`} name={"teste"} />
        {/each}
    </div>
</div>
