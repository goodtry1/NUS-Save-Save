let api_url;

if (process.env.NODE_ENV === "development") {
    api_url = "http:localhost:5001"
} else if (process.env.NODE_ENV === "production") {
    api_url = "<server name>"
}

export const api = {api_url}