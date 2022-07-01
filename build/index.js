"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("./routes/app");
const hash_1 = require("./routes/hash");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});
app.use("/app", app_1.appRouter);
app.use("/hash", hash_1.hashRouter);
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
    }));
});
//Yeet
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
