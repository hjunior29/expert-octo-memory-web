export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object
): Promise<T> {
    try {
        const response = await fetch(`api/${endpoint}`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: method !== "GET" && body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}