interface ApiResponse<T> {
    status: number;
    message: string;
    data?: T;
}

export async function apiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object,
    params?: number | string
): Promise<T> {
    try {
        const url = params ? `api/${endpoint}/${params}` : `api/${endpoint}`;

        const resquest = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: method !== "GET" && body ? JSON.stringify(body) : undefined,
        });

        if (!resquest.ok) {
            throw new Error(`Erro: ${resquest.status} - ${resquest.statusText}`);
        }

        const apiResponse = await resquest.json();

        const response: ApiResponse<T> = {
            status: apiResponse.status,
            message: apiResponse.message,
            data: apiResponse.data,
        };

        return response as T;

    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
}