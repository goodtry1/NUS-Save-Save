let api;

if (process.env.NODE_ENV === "development") {
    api = "http://localhost:5001/api"
} else if (process.env.NODE_ENV === "production") {
    //api = "http://localhost:5000"             // for serving in local host
    api = "http://172.25.76.183/api"            // for serving in our linux server :D
}

export { api } 