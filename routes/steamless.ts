import express from "express";
import path from "path"
import fetch from "cross-fetch"
import { getHash } from "../util/getHash";

export const steamlessRouter = express.Router()
steamlessRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://github.com/atom0s/Steamless/releases";

    const response = await fetch(UPSTREAM_API, {
        method: "GET",
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
        },
    });

    if (response.ok) {
        const text = await response.text()
        const Match = text.match(new RegExp(
            /(\/atom0s\/Steamless\/releases\/download\/v(?<version>[\d.]+)\/Steamless.v[\d.]+.-.by.atom0s.zip)/
        ));
        if (Match) {
            const url = `https://github.com${Match[0]}`
            const name = path.basename(url)
            const version = Match[2]
            const hash = await getHash(url, name, version)

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