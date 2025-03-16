<script lang="ts">
    import {
        Button,
        Modal,
        Tabs,
        Tab,
        TabContent,
        FileUploader,
        TextInput,
    } from "carbon-components-svelte";
    import { AiGenerate } from "carbon-icons-svelte";

    let openGenerateAiFlashcardsModal: boolean = false;
    let fileUploader;
    let files: File[] = [];

    function generateFlashcards() {
        console.log("Generating flashcards...");
    }
</script>

<div class="flex justify-end">
    <Button
        icon={AiGenerate}
        on:click={() => {
            openGenerateAiFlashcardsModal = true;
        }}>Gerar Flashcards</Button
    >
</div>

<Modal
    bind:open={openGenerateAiFlashcardsModal}
    modalHeading="Gerar Flashcards"
    primaryButtonIcon={AiGenerate}
    primaryButtonText="Gerar"
    secondaryButtonText="Cancelar"
    on:click:button--secondary={() => (openGenerateAiFlashcardsModal = false)}
    on:open
    on:close
    on:submit={generateFlashcards}
>
    <p>
        Você pode gerar flashcards a partir de links de sites, vídeos do
        YouTube, vídeos enviados à plataforma ou apenas descrevendo o assunto
        que deseja.
    </p>
    <br />
    <Tabs type="container">
        <Tab label="Arquivo" />
        <Tab label="Link" />
        <Tab label="Texto" />
        <Tab label="Assunto" />
        <svelte:fragment slot="content">
            <TabContent>
                <div>
                    <p>Envie um PDF, imagem, DOCX ou áudio MP3.</p>
                </div>
                <FileUploader
                    bind:this={fileUploader}
                    multiple
                    labelTitle="Upload files"
                    buttonLabel="Adicionar arquivo"
                    labelDescription="Clique para adicionar"
                    accept={[".pdf", ".docx", ".jpg", ".jpeg", ".png", ".mp3"]}
                    status="complete"
                    bind:files
                />
                {#if files.length}
                    <br />
                    <Button
                        size="small"
                        kind="tertiary"
                        disabled={!files.length}
                        on:click={fileUploader.clearFiles}
                    >
                        Limpar
                    </Button>
                {/if}
            </TabContent>

            <TabContent>
                <div>
                    <p>Cole o link de um site ou vídeo.</p>
                </div>
                <TextInput
                    invalidText="Link é obrigatório."
                    labelText="Link *"
                    placeholder="Cole o link..."
                />
            </TabContent>
            <TabContent>
                <div>
                    <p>Cole o texto de um determinado assunto.</p>
                </div>
                <TextInput
                    invalidText="Texto é obrigatório."
                    labelText="Texto *"
                    placeholder="Cole o texto..."
                />
            </TabContent>
            <TabContent>
                <div>
                    <p>Escreva sobre o assunto.</p>
                </div>
                <TextInput
                    invalidText="Texto é obrigatório."
                    labelText="Texto"
                    placeholder="Escreva sobre o assunto..."
                />
            </TabContent>
        </svelte:fragment>
    </Tabs>
</Modal>
