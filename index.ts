import express from "express";
import { appRouter } from "./routes/app/app"
import { messengerRouter } from "./routes/app/messenger";
import { windowsTerminalRouter } from "./routes/app/windowsTerminal";
import { hashRouter } from "./routes/hash/hash";
import { steamlessRouter } from "./routes/hash/steamless";

const app = express()
const PORT = 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/app/messenger", messengerRouter)
app.use("/app/windowsTerminal", windowsTerminalRouter)
app.use("/hash/steamless", steamlessRouter)

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