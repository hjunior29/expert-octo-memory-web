<script lang="ts">
    import { goto } from "$app/navigation";
    import { apiRequest } from "$lib/api/utils";
    import type { ApiResponse } from "$lib/models/apiResponse";
    import type { Notification } from "$lib/models/notification";
    import {
        Button,
        ProgressBar,
        ToastNotification,
    } from "carbon-components-svelte";
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    interface PingPong {
        message: string;
    }

    let apiPingSuccess: boolean = false;
    let notification: Notification = {};
    let timeout: any = undefined;
    let mounted = false;
    let isFlipped1 = false;
    let isFlipped2 = false;

    onMount(() => {
        mounted = true;
        apiWakeUp();
    });

    function flipCard1() {
        isFlipped1 = !isFlipped1;
    }

    function flipCard2() {
        isFlipped2 = !isFlipped2;
    }

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
                const message = `A API demorou ${duration} segundos para responder após ${attempts} tentativa(s).`;

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

    const features = [
        {
            icon: "brain",
            title: "Geração com IA",
            description:
                "Gere flashcards automaticamente a partir de textos, PDFs, imagens e até áudios usando inteligência artificial.",
        },
        {
            icon: "folder",
            title: "Organização Intuitiva",
            description:
                "Organize seus estudos em pastas e tópicos. Encontre tudo rapidamente quando precisar revisar.",
        },
        {
            icon: "share",
            title: "Compartilhamento Fácil",
            description:
                "Compartilhe seus flashcards com amigos e colegas através de links públicos.",
        },
        {
            icon: "chart",
            title: "Acompanhe seu Progresso",
            description:
                "Visualize estatísticas de revisão e acompanhe sua evolução ao longo do tempo.",
        },
        {
            icon: "flip",
            title: "Estudo Interativo",
            description:
                "Cards com animação flip 3D para uma experiência de estudo envolvente e eficiente.",
        },
        {
            icon: "download",
            title: "Exportar PDF",
            description:
                "Baixe seus flashcards em PDF para estudar offline quando quiser.",
        },
    ];
</script>

<div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="hero-content">
            {#if mounted}
                <div in:fly={{ y: -30, duration: 800, delay: 100 }}>
                    <div class="flex justify-starts items-center gap-4">
                        <span class="hero-badge">Open Source</span>
                        <img
                            src="/logo.png"
                            alt="OCTO"
                            class="hero-logo-icon"
                        />
                    </div>
                </div>
                <h1
                    class="hero-title"
                    in:fly={{ y: -30, duration: 800, delay: 200 }}
                >
                    Aprenda mais rápido com
                    <span class="gradient-text">OCTO Memory</span>
                </h1>
                <p
                    class="hero-subtitle"
                    in:fly={{ y: -30, duration: 800, delay: 300 }}
                >
                    Um projeto de flashcards que utiliza IA para transformar
                    qualquer conteúdo em material de estudo. Feito com carinho
                    para quem ama aprender.
                </p>
                <div
                    class="hero-buttons"
                    in:fly={{ y: -30, duration: 800, delay: 400 }}
                >
                    <Button
                        disabled={!apiPingSuccess}
                        kind="primary"
                        size="lg"
                        on:click={() => goto("/register")}
                    >
                        Começar a usar
                    </Button>
                    <Button
                        disabled={!apiPingSuccess}
                        kind="tertiary"
                        size="lg"
                        on:click={() => goto("/login")}
                    >
                        Já tenho conta
                    </Button>
                </div>
            {/if}
        </div>

        <!-- Interactive Flip Cards -->
        <div class="hero-visual">
            {#if mounted}
                <!-- Card 1 -->
                <div
                    class="demo-card-wrapper card-pos-1"
                    in:fly={{ x: 50, duration: 1000, delay: 600 }}
                >
                    {#if !isFlipped1}
                        <div class="click-hint">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M15 15l6 6m-6-6v4.8m0-4.8h4.8" />
                                <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
                                <path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
                                <path d="M9 4.2V9m0 0H4.2M9 9L3 3" />
                            </svg>
                            <span>Clique para virar</span>
                        </div>
                    {/if}
                    <div
                        class="demo-card"
                        on:click={flipCard1}
                        on:keydown={(e) => e.key === "Enter" && flipCard1()}
                        role="button"
                        tabindex="0"
                    >
                        <div
                            class="demo-card-inner {isFlipped1
                                ? 'flipped'
                                : ''}"
                        >
                            <div class="demo-card-front">
                                <span class="card-label">Pergunta</span>
                                <p>
                                    Qual foi o estopim da Primeira Guerra
                                    Mundial?
                                </p>
                            </div>
                            <div class="demo-card-back">
                                <span class="card-label">Resposta</span>
                                <p>
                                    O assassinato do arquiduque Franz Ferdinand
                                    em Sarajevo, 1914
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Card 2 -->
                <div
                    class="demo-card-wrapper card-pos-2"
                    in:fly={{ x: -50, duration: 1000, delay: 900 }}
                >
                    <div
                        class="demo-card"
                        on:click={flipCard2}
                        on:keydown={(e) => e.key === "Enter" && flipCard2()}
                        role="button"
                        tabindex="0"
                    >
                        <div
                            class="demo-card-inner {isFlipped2
                                ? 'flipped'
                                : ''}"
                        >
                            <div class="demo-card-front">
                                <span class="card-label">Pergunta</span>
                                <p>O que foi a Revolução Francesa?</p>
                            </div>
                            <div class="demo-card-back">
                                <span class="card-label">Resposta</span>
                                <p>
                                    Movimento que derrubou a monarquia
                                    absolutista na França em 1789
                                </p>
                            </div>
                        </div>
                    </div>
                    {#if !isFlipped2}
                        <div class="click-hint">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M15 15l6 6m-6-6v4.8m0-4.8h4.8" />
                                <path d="M9 19.8V15m0 0H4.2M9 15l-6 6" />
                                <path d="M15 4.2V9m0 0h4.8M15 9l6-6" />
                                <path d="M9 4.2V9m0 0H4.2M9 9L3 3" />
                            </svg>
                            <span>Clique para virar</span>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
        <div class="features-header">
            {#if mounted}
                <h2 in:fly={{ y: 30, duration: 800, delay: 200 }}>
                    Recursos para <span class="gradient-text"
                        >aprender melhor</span
                    >
                </h2>
                <p in:fly={{ y: 30, duration: 800, delay: 300 }}>
                    Ferramentas simples e eficientes para seus estudos
                </p>
            {/if}
        </div>

        <div class="features-grid">
            {#each features as feature, i}
                {#if mounted}
                    <div
                        class="feature-card"
                        in:fly={{ y: 30, duration: 600, delay: 400 + i * 100 }}
                    >
                        <div class="feature-icon">
                            {#if feature.icon === "brain"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 12 4.5"
                                    />
                                    <path d="m15.7 10.4-.9.4" />
                                    <path d="m9.2 13.2-.9.4" />
                                    <path d="m13.6 15.7-.4-.9" />
                                    <path d="m10.8 9.2-.4-.9" />
                                    <path d="m15.7 13.5-.9-.4" />
                                    <path d="m9.2 10.9-.9-.4" />
                                    <path d="m10.4 15.7.4-.9" />
                                    <path d="m13.1 9.2.4-.9" />
                                </svg>
                            {:else if feature.icon === "folder"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
                                    />
                                </svg>
                            {:else if feature.icon === "share"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line
                                        x1="8.59"
                                        x2="15.42"
                                        y1="13.51"
                                        y2="17.49"
                                    />
                                    <line
                                        x1="15.41"
                                        x2="8.59"
                                        y1="6.51"
                                        y2="10.49"
                                    />
                                </svg>
                            {:else if feature.icon === "chart"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M3 3v18h18" />
                                    <path d="m19 9-5 5-4-4-3 3" />
                                </svg>
                            {:else if feature.icon === "flip"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M17 3v2" />
                                    <path d="m17 7-3 3-4-4-6 6" />
                                    <path d="M17 21v-2" />
                                    <path d="m17 17-3-3-4 4-6-6" />
                                    <rect
                                        width="20"
                                        height="14"
                                        x="2"
                                        y="5"
                                        rx="2"
                                    />
                                </svg>
                            {:else if feature.icon === "download"}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path
                                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                                    />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                            {/if}
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                {/if}
            {/each}
        </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
        <div class="section-header">
            {#if mounted}
                <h2 in:fly={{ y: 30, duration: 800 }}>Como funciona?</h2>
                <p in:fly={{ y: 30, duration: 800, delay: 100 }}>
                    Em apenas 3 passos simples
                </p>
            {/if}
        </div>

        <div class="steps-container">
            {#if mounted}
                <div class="step" in:fly={{ y: 30, duration: 600, delay: 200 }}>
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>Envie seu conteúdo</h3>
                        <p>
                            Cole um texto, envie um PDF, imagem, áudio ou até
                            uma URL.
                        </p>
                    </div>
                </div>

                <div class="step-connector"></div>

                <div class="step" in:fly={{ y: 30, duration: 600, delay: 400 }}>
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>Flashcards são gerados</h3>
                        <p>
                            A IA processa o conteúdo e cria flashcards com
                            perguntas e respostas relevantes.
                        </p>
                    </div>
                </div>

                <div class="step-connector"></div>

                <div class="step" in:fly={{ y: 30, duration: 600, delay: 600 }}>
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>Estude e aprenda</h3>
                        <p>
                            Use o modo de estudo interativo e acompanhe seu
                            progresso de memorização.
                        </p>
                    </div>
                </div>
            {/if}
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        {#if mounted}
            <div class="cta-content" in:fly={{ y: 30, duration: 800 }}>
                <h2>Bora estudar?</h2>
                <p>Crie sua conta e comece a usar agora mesmo.</p>
                <div class="cta-buttons">
                    <Button
                        disabled={!apiPingSuccess}
                        kind="primary"
                        size="lg"
                        on:click={() => goto("/register")}
                    >
                        Criar conta
                    </Button>
                </div>
            </div>
        {/if}
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
        <div class="footer-content">
            <img src="/logo.png" alt="OCTO" class="footer-logo-icon" />
            <p class="footer-text">
                Feito com Svelte e Golang por <a
                    href="https://github.com/hjunior29"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link">hjunior29</a
                ><span class="heart">&#10084;</span>
            </p>
        </div>
    </footer>
</div>

<!-- Notifications -->
<div class="fixed bottom-4 right-4 w-96 z-50">
    {#if notification.kind}
        <div class="transition-opacity duration-300" transition:fade>
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
        </div>
    {/if}

    {#if !apiPingSuccess}
        <div class="transition-opacity duration-300" transition:fade>
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
            <ProgressBar
                size="sm"
                helperText="Api acordando..."
                class="w-9/12"
            />
        </div>
    {/if}
</div>

<style>
    .landing-page {
        min-height: 100vh;
        background: linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 50%,
            #0f172a 100%
        );
        color: white;
        overflow-x: hidden;
    }

    /* Hero Section */
    .hero-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6rem 4rem;
        position: relative;
        gap: 4rem;
    }

    .hero-content {
        flex: 1;
        max-width: 600px;
    }

    .hero-badge {
        display: inline-block;
        background: linear-gradient(135deg, #5ac8fa 0%, #34d399 100%);
        color: #0f172a;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .hero-logo-icon {
        width: 64px;
        height: auto;
        margin-bottom: 0;
    }

    .hero-title {
        font-size: 3.5rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1.5rem;
    }

    .gradient-text {
        background: linear-gradient(135deg, #5ac8fa 0%, #34d399 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-subtitle {
        font-size: 1.25rem;
        color: #94a3b8;
        line-height: 1.7;
        margin-bottom: 2rem;
    }

    .hero-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .hero-visual {
        flex: 1;
        position: relative;
        height: 500px;
        display: none;
    }

    @media (min-width: 1024px) {
        .hero-visual {
            display: block;
        }
    }

    /* Demo Card Wrapper */
    .demo-card-wrapper {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        animation: float 6s ease-in-out infinite;
    }

    .card-pos-1 {
        top: 0%;
        right: 5%;
        animation-delay: 0s;
    }

    .card-pos-2 {
        bottom: 5%;
        right: 35%;
        animation-delay: 3s;
    }

    /* Demo Flip Card */
    .demo-card {
        perspective: 1000px;
        width: 280px;
        height: 160px;
        cursor: pointer;
    }

    .demo-card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }

    .demo-card-inner.flipped {
        transform: rotateY(180deg);
    }

    .demo-card-front,
    .demo-card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        border-radius: 1rem;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .demo-card-front {
        background: #1f2937;
    }

    .demo-card-back {
        background: #568759;
        transform: rotateY(180deg);
    }

    .card-label {
        display: block;
        font-size: 0.7rem;
        color: #5ac8fa;
        font-weight: 600;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .demo-card-back .card-label {
        color: #a7f3d0;
    }

    .demo-card-front p,
    .demo-card-back p {
        font-size: 0.9rem;
        color: #e2e8f0;
        margin: 0;
        line-height: 1.4;
    }

    /* Click Hint */
    .click-hint {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #5ac8fa;
        font-size: 0.75rem;
        animation: pulse-hint 2s ease-in-out infinite;
    }

    .click-hint svg {
        animation: bounce-arrow 1s ease-in-out infinite;
    }

    @keyframes pulse-hint {
        0%,
        100% {
            opacity: 0.7;
        }
        50% {
            opacity: 1;
        }
    }

    @keyframes bounce-arrow {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-15px);
        }
    }

    /* Features Section */
    .features-section {
        padding: 6rem 4rem;
        background: rgba(30, 41, 59, 0.5);
    }

    .features-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .features-mascot {
        width: 120px;
        height: auto;
        margin-bottom: 1.5rem;
        filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
    }

    .features-header h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .features-header p {
        color: #94a3b8;
        font-size: 1.125rem;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .feature-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(90, 200, 250, 0.2);
        padding: 2rem;
        transition: all 0.3s ease;
    }

    .feature-card:hover {
        transform: translateY(-4px);
        border-color: #5ac8fa;
        box-shadow: 0 20px 40px rgba(90, 200, 250, 0.15);
    }

    .feature-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(
            135deg,
            rgba(90, 200, 250, 0.2) 0%,
            rgba(52, 211, 153, 0.2) 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1.5rem;
        color: #5ac8fa;
    }

    .feature-card h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: white;
    }

    .feature-card p {
        color: #94a3b8;
        line-height: 1.6;
        font-size: 0.9rem;
    }

    /* How It Works Section */
    .how-it-works-section {
        padding: 6rem 4rem;
    }

    .section-header {
        text-align: center;
        margin-bottom: 4rem;
    }

    .section-header h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .section-header p {
        color: #94a3b8;
        font-size: 1.125rem;
    }

    .steps-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 600px;
        margin: 0 auto;
    }

    @media (min-width: 768px) {
        .steps-container {
            flex-direction: row;
            max-width: 1000px;
            gap: 0;
        }
    }

    .step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        flex: 1;
        padding: 1.5rem;
    }

    .step-number {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #5ac8fa 0%, #34d399 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 1.5rem;
    }

    .step-content h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
    }

    .step-content p {
        color: #94a3b8;
        line-height: 1.6;
        font-size: 0.95rem;
    }

    .step-connector {
        width: 2px;
        height: 40px;
        background: linear-gradient(to bottom, #5ac8fa, #34d399);
    }

    @media (min-width: 768px) {
        .step-connector {
            width: 80px;
            height: 2px;
            background: linear-gradient(to right, #5ac8fa, #34d399);
        }
    }

    /* CTA Section */
    .cta-section {
        padding: 6rem 4rem;
        background: linear-gradient(
            135deg,
            rgba(90, 200, 250, 0.1) 0%,
            rgba(52, 211, 153, 0.1) 100%
        );
    }

    .cta-content {
        text-align: center;
        max-width: 600px;
        margin: 0 auto;
    }

    .cta-logo {
        width: 280px;
        height: auto;
        margin-bottom: 2rem;
    }

    .cta-content h2 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .cta-content p {
        color: #94a3b8;
        font-size: 1.125rem;
        margin-bottom: 2rem;
    }

    .cta-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    /* Footer */
    .landing-footer {
        padding: 2rem 4rem;
        background: rgba(15, 23, 42, 0.8);
        border-top: 1px solid rgba(90, 200, 250, 0.1);
    }

    .footer-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .footer-logo-icon {
        width: 48px;
        height: auto;
        opacity: 0.8;
        transition: opacity 0.2s ease;
    }

    .footer-logo-icon:hover {
        opacity: 1;
    }

    .footer-text {
        color: #94a3b8;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .footer-link {
        color: #5ac8fa;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    .footer-link:hover {
        color: #34d399;
    }

    .heart {
        color: #f87171;
        margin-left: 0.25rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .hero-section {
            padding: 4rem 1.5rem;
            flex-direction: column;
        }

        .hero-title {
            font-size: 2.5rem;
        }

        .features-section,
        .how-it-works-section,
        .cta-section {
            padding: 4rem 1.5rem;
        }

        .features-header h2,
        .section-header h2,
        .cta-content h2 {
            font-size: 2rem;
        }

        .landing-footer {
            padding: 1.5rem;
        }
    }
</style>
