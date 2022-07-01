import express from "express";
import { alasRouter, messengerRouter, steamlessRouter, windowsTerminalRouter } from "./deps"

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/alas", alasRouter)
app.use("/messenger", messengerRouter)
app.use("/windows_terminal", windowsTerminalRouter)
app.use("/steamless", steamlessRouter)

app.get("/", (req, res) => {
    res.status(200).send(JSON.stringify({
        message: "need to specify an action",
        help: "https://github.com/ArudenKun/scoop-bucket/tree/api",
        apps: [
            "/messenger",
            "/messenger?dl",
            "/windows_terminal",
            "/windows_terminal?dl",
            "/steamless",
            "/steamless?dl"
        ]
    }))
})

app.listen(port, () => console.log(`Listening on http://localhost:${port}`))