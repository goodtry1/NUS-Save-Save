let api;

if (process.env.NODE_ENV === "development") {
    api = "http://localhost:5001"
} else if (process.env.NODE_ENV === "production") {
    api = "http://localhost:5001"
}

export { api } 