"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apps_1 = require("./routes/apps");
const hash_1 = require("./routes/hash");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
});
app.use("/apps", apps_1.appsRouter);
app.use("/hash", hash_1.hashRouter);
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
    }));
});
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
