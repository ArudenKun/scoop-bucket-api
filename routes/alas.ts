import express from "express";
import fetch from "cross-fetch";
import crypto from "crypto"
import path from "path"
import fs from "fs"
import { downloadFromUrl } from "../util/downloadFromUrl";

export const alasRouter = express.Router()
alasRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://github.com/LmeSzinc/AzurLaneAutoScript/releases/latest";
    const response = await fetch(UPSTREAM_API, {
        method: "GET",
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
            "accept-encoding": "gzip, deflate, br",
        },
    });

    
    if (response.ok) {
        const text = await response.text();
        const Match = text.match(new RegExp(
            /(\/LmeSzinc\/AzurLaneAutoScript\/releases\/download\/v(?<date>.+?)\/(?<name>A.+?(?<version>[\d.]+).7z))/
        ))
        if (Match) {
            const url = `https://github.com${Match[0]}`
            const fileName = path.basename(url)
            const name = Match[3]
            const version = Match[4]
            const hash = crypto.createHash('sha256');

            let fileHash;
            try {
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
            const fullUrl: string = `${req.protocol}://${req.get('host')}${req.originalUrl}`
            const sp = new URLSearchParams(new URL(fullUrl).search);

            if (sp.has("dl")) {
                return res.redirect(302, "url");
            }

            return res.send(
                JSON.stringify({
                    url: url,
                    name: name,
                    version: version,
                    sha256: fileHash,
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