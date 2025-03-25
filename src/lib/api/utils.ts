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
        const url = params ? `/api/${endpoint}/${params}` : `/api/${endpoint}`;
        const request = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: method !== "GET" && body ? JSON.stringify(body) : undefined,
        });

        if (!request.ok) {
            const response: ApiResponse<T> = {
                status: request.status,
                message: request.statusText,
                data: undefined
            }

            return response as T;
        }

        const apiResponse = await request.json();

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