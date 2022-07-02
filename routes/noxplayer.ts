import { downloadFromUrl } from "../util/downloadFromUrl";
import express from "express";
import fetch from "cross-fetch";
import path from "path"
import fs from "fs"
import { hasher } from "../deps";

export const noxPlayerRouter = express.Router()
noxPlayerRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://www.bignox.com/";
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
        const versionMatch = text.match(new RegExp(
            /Version (?<version>[\d.]+)/
        ));
        if (text) {
            const origUrl = `https://www.bignox.com/en/download/fullPackage?beta`
            const origName = path.basename(origUrl)
            const version = versionMatch![1]
            let hash;
            let newName;

            const jsonData = fs.readFileSync("./hashTable.json", "utf-8")
            const data = JSON.parse(jsonData)

            if (data.noxplayer.version == version) {
                hash = data.noxplayer.hash
            } else {
                try {

                    const response = await fetch(origUrl, {
                        method: "GET",
                        headers: {
                            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
                            "content-type": "application/x-www-form-urlencoded",
                        },
                    })

                    if (!response.ok) {
                        return res.status(500).send(
                            JSON.stringify({
                                message: "couldn't process your request"
                            }),
                        )
                    }

                    const newUrl = response.url
                    newName = path.basename(newUrl)
                    console.log(newUrl)
                    await downloadFromUrl(newUrl, "tmp")
                    const file = fs.readFileSync(`tmp/${newName}`)
                    hasher.update(file);
                    hash = hasher.digest("hex")
                    fs.unlink(`tmp/${newName}`, (err) => {
                        if (err) throw err
                    })
                    data.noxplayer.hash = hash
                    data.noxplayer.version = version
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
                return res.redirect(302, origUrl);
            }

            return res.send(
                JSON.stringify({
                    url: origUrl,
                    name: newName,
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