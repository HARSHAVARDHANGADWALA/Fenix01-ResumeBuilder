const API_URL = "http://localhost:5000/api";

async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,

            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
                ...options.headers,
            },
        }
    );

    if (response.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/login";

        throw new Error("Session expired");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Something went wrong"
        );
    }

    return data;
}

export default apiRequest;