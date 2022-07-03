import express from "express";
import mongoose from "mongoose";
import "dotenv/config"
import {
    alasRouter,
    messengerRouter,
    noxPlayerRouter,
    steamlessRouter,
    windowsTerminalRouter
} from "./deps"
import { log } from "./util/logger";

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
})

app.use("/alas", alasRouter)
app.use("/messenger", messengerRouter)
app.use("/noxplayer", noxPlayerRouter)
app.use("/steamless", steamlessRouter)
app.use("/windows_terminal", windowsTerminalRouter)

app.get("/", (req, res) => {
    res.status(200).send(JSON.stringify({
        message: "need to specify an action",
        help: "https://github.com/ArudenKun/scoop-bucket/tree/api",
        apps: [
            "/alas",
            "/alas?dl",
            "/messenger",
            "/messenger?dl",
            "/noxplayer",
            "/noxplayer?dl",
            "/steamless",
            "/steamless?dl",
            "/windows_terminal",
            "/windows_terminal?dl",
        ]
    }))
})

app.listen(port, async () => {
    log.info(`Listening on http://localhost:${port}`)
    if (!process.env.MONGODB_URI) return;
    await mongoose.connect(process.env.MONGODB_URI, { keepAlive: true })
        .then(() => {
            log.info("Client is now connected to the database");
        })
        .catch((err) => {
            log.error(err);
        });
})