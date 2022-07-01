import express from "express";
import fetch from "cross-fetch";

export const messengerRouter = express.Router()
messengerRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://store.rg-adguard.net/api/GetFiles";
    // `9WZDNCRF0083` refers to:
    // https://apps.microsoft.com/store/detail/messenger/9WZDNCRF0083?hl=en-ph&gl=ph
    const BODY = `type=ProductId&url=9WZDNCRF0083&ring=Retail&lang=en-US`;

    const response = await fetch(UPSTREAM_API, {
        method: "POST",
        body: BODY,
        headers: {
            "user-agent": "Deno/1.0 (Deno Deploy) Scoop/1.0 (https://scoop.sh)",
            "content-type": "application/x-www-form-urlencoded",
        },
    });

    if (response.ok) {
        const text = await response.text();
        const re = new RegExp(/href="(?<url>http:\/\/t.+?)".+?(?<name>FA.+?0BB486_(?<version>[\d.]+).+?8xx8rvfyw5nnt.appx).+?">(?<sha1>\w{40})</sm);
        const groups = text.match(re);
        if (groups) {
            const url = groups[1]
            const name = groups[2]
            const version = groups[3]
            const hash = groups[4]

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
                    sha1: hash,
                }),
            )
        }
    }
    //test
    return res.status(500).send(
        JSON.stringify({
            message: "couldn't process your request"
        }),
    )
})