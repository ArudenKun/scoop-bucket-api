import express from "express";
import { appRouter } from "./api/app/app"
import { messengerRouter } from "./api/app/messenger";
import { hashRouter } from "./api/hash/hash";

const app = express()
const PORT = 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/api/app", appRouter)
app.use("/api/app", hashRouter)
app.use("/api/app/messenger", messengerRouter)

app.get("/", (req, res) => {
    res.status(200).send(JSON.stringify({
        message: "need to specify an action",
        help: "https://github.com/ArudenKun/scoop-bucket/tree/api",
        actions: [
            "/app/appx_messenger",
            "/app/appx_messenger?dl",
            "/app/msix_windows_terminal",
            "/app/msix_windows_terminal?dl",
            "/hash/steamless_hash"
        ]
    }))
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))