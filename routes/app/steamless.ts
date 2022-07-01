import express from "express";
import fetch from "cross-fetch";
import crypto from "crypto"
import path from "path"
import fs from "fs"
import { downloadFromUrl } from "../../util/downloadFromUrl";

export const steamlessRouter = express.Router()
steamlessRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://github.com/atom0s/Steamless/tags";
    const response = await fetch(UPSTREAM_API, {
        method: "GET",
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
            "accept-encoding": "gzip, deflate, br",
        },
    });
    const hash = crypto.createHash('sha256');
    if (response.ok) {
        const text = await response.text();
        const Match = text.match(new RegExp(/"(\/atom0s\/Steamless\/archive\/refs\/tags\/v(?<version>\d(\.\d)+)\.zip)"/, "g"));
        const version = Match![0].replaceAll(/(\/atom0s\/Steamless\/archive\/refs\/tags\/)|\"|v|.zip/g, "")
        const url = `https://github.com/atom0s/Steamless/releases/download/v${version}/Steamless.v${version}.-.by.atom0s.zip`

        let fileHash;
        try {
            const fileName = path.basename(url)
            await downloadFromUrl(url, "tmp")
            const file = fs.readFileSync(`tmp/${fileName}`)
            hash.update(file);
            fileHash = hash.digest("hex")
            fs.unlink(`tmp/${fileName}`, (err) => {
                if (err) throw err
            })
        } catch (error) {
            console.log(error);
        }

        if (text) {
            const fullUrl: string = `${req.protocol}://${req.get('host')}${req.originalUrl}`
            const sp = new URLSearchParams(new URL(fullUrl).search);

            if (sp.has("dl")) {
                return res.redirect(302, url);
            }

            return res.send(
                JSON.stringify({
                    url: url,
                    version: version,
                    sha256: fileHash
                })
            )
        }
    }

    return res.status(500).send(
        JSON.stringify({
            message: "couldn't process your request"
        }),
    )
})