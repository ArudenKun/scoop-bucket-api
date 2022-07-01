"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashRouter = void 0;
const express_1 = __importDefault(require("express"));
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const downloadFromUrl_1 = require("../util/downloadFromUrl");
exports.hashRouter = express_1.default.Router();
exports.hashRouter.get("/steamless_hash", async (req, res) => {
    const UPSTREAM_API = "https://github.com/atom0s/Steamless/tags";
    const response = await (0, cross_fetch_1.default)(UPSTREAM_API, {
        method: "GET",
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
            "accept-encoding": "gzip, deflate, br",
        },
    });
    const hash = crypto_1.default.createHash('sha256');
    if (response.ok) {
        const text = await response.text();
        const Match = text.match(new RegExp(/"(\/atom0s\/Steamless\/archive\/refs\/tags\/v(?<version>\d(\.\d)+)\.zip)"/, "g"));
        const version = Match[0].replaceAll(/(\/atom0s\/Steamless\/archive\/refs\/tags\/)|\"|v|.zip/g, "");
        const url = `https://github.com/atom0s/Steamless/releases/download/v${version}/Steamless.v${version}.-.by.atom0s.zip`;
        let fileHash;
        try {
            const fileName = path_1.default.basename(url);
            await (0, downloadFromUrl_1.downloadFromUrl)(url, "tmp");
            const file = fs_1.default.readFileSync(`tmp/${fileName}`);
            hash.update(file);
            fileHash = hash.digest("hex");
            fs_1.default.unlink(`tmp/${fileName}`, (err) => {
                if (err)
                    throw err;
            });
        }
        catch (error) {
            console.log(error);
        }
        if (text) {
            return res.send(JSON.stringify({
                url: url,
                version: version,
                sha256: fileHash
            }));
        }
    }
    return res.status(500).send(JSON.stringify({
        message: "couldn't process your request"
    }));
});
