import express from "express";
import fetch from "cross-fetch";
import path from "path"
import { getHash } from "../util/getHash";

export const noxPlayerRouter = express.Router()
noxPlayerRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://www.bignox.com/";
    const response = await fetch(UPSTREAM_API, {
        method: "GET",
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
        },
    });

    if (response.ok) {
        const text = await response.text();
        const versionMatch = text.match(new RegExp(
            /Version (?<version>[\d.]+)/
        ));
        if (text) {
            const url = `https://www.bignox.com/en/download/fullPackage?beta`
            const name = path.basename((await fetch(url)).url).match(/nox_setup_.+?.exe/)![0]
            const version = versionMatch![1]
            const hash = await getHash(url, name, version);

            // if (hashes.noxplayer.version == version) {
            //     hash = hashes.noxplayer.hash
            // } else {
            //     hash = await getHash("https://www.bignox.com/en/download/fullPackage?beta")
            //     hashes.noxplayer.version = version
            //     hashes.noxplayer.hash = hash
            //     await writeHash(hashes)
            // }

            const fullUrl: string = `${req.protocol}://${req.get('host')}${req.originalUrl}`
            const sp = new URLSearchParams(new URL(fullUrl).search);

            if (sp.has("dl")) {
                return res.redirect(302, url);
            }

            return res.send(
                JSON.stringify({
                    url: url,
                    name: name,
                    version: version,
                    sha256: hash
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