import express from "express";
import { appsRouter } from "./routes/apps"
import { hashRouter } from "./routes/hash";

const app = express()
const PORT = 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/apps", appsRouter)
app.use("/hash", hashRouter)

app.get("/", (req, res) => {
    res.status(200).send(JSON.stringify({
        message: "need to specify an action",
        help: "https://github.com/ArudenKun/scoop-bucket/tree/api",
        actions: [
            "/appx_messenger",
            "/appx_messenger?dl",
            "/msix_windows_terminal",
            "/msix_windows_terminal?dl",
            "/steamless_hash"
        ]
    }))
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))