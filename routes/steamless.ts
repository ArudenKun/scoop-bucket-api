import { getHash } from "../util/getHash";
import express from "express";
import path from "path"
import got from "got";
import { hashes } from "../deps";
import { writeHash } from "../util/writeHash";

export const steamlessRouter = express.Router()
steamlessRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://github.com/atom0s/Steamless/releases";

    const response = got(UPSTREAM_API)

    if (response) {
        const text = await response.text()
        const Match = text.match(new RegExp(
            /(\/atom0s\/Steamless\/releases\/download\/v(?<version>[\d.]+)\/Steamless.v[\d.]+.-.by.atom0s.zip)/
        ));
        if (Match) {
            const url = `https://github.com${Match[0]}`
            const name = path.basename(url)
            const version = Match[2]
            let hash;

            if (hashes.steamless.version == version) {
                hash = hashes.steamless.hash
            } else {
                hash = await getHash(url)
                hashes.steamless.version = version
                hashes.steamless.hash = hash
                await writeHash(hashes)
            }

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