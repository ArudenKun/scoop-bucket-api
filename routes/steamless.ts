import { downloadFromUrl } from "../util/downloadFromUrl";
import express from "express";
import fetch from "cross-fetch";
import path from "path"
import fs from "fs"
import { hasher } from "../deps";

export const steamlessRouter = express.Router()
steamlessRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://github.com/atom0s/Steamless/releases";
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
            /(\/atom0s\/Steamless\/releases\/download\/v(?<version>[\d.]+)\/Steamless.v[\d.]+.-.by.atom0s.zip)/
        ));
        if (Match) {
            const url = `https://github.com${Match[0]}`
            const fileName = path.basename(url)
            const name = fileName
            const version = Match[2]
            let hash;

            const jsonData = fs.readFileSync("./hashTable.json", "utf-8")
            const data = JSON.parse(jsonData)

            if (data.steamless.version == version) {
                hash = data.steamless.hash
            } else {
                try {
                    await downloadFromUrl(url, "tmp")
                    const file = fs.readFileSync(`tmp/${fileName}`)
                    hasher.update(file);
                    hash = hasher.digest("hex")
                    fs.unlink(`tmp/${fileName}`, (err) => {
                        if (err) throw err
                    })
                    data.steamless.hash = hash
                    data.steamless.version = version
                    fs.writeFile("./hashTable.json", JSON.stringify(data), err => {
                        if (err) {
                            console.log(err)
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
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