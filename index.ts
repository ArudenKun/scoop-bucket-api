import express from "express";
import { messengerRouter } from "./routes/app/messenger";
import { windowsTerminalRouter } from "./routes/app/windowsTerminal";
import { steamlessRouter } from "./routes/app/steamless";

const app = express()
const PORT = 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/app/messenger", messengerRouter)
app.use("/app/windowsTerminal", windowsTerminalRouter)
app.use("/app/steamless", steamlessRouter)

app.get("/", (req, res) => {
    res.status(200).send(JSON.stringify({
        message: "need to specify an action",
        help: "https://github.com/ArudenKun/scoop-bucket/tree/api",
        apps: [
            "/app/appx_messenger",
            "/app/appx_messenger?dl",
            "/app/msix_windows_terminal",
            "/app/msix_windows_terminal?dl",
            "/hash/steamless_hash"
        ]
    }))
})

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))