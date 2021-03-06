import express from "express";
import fetch from "cross-fetch";

export const windowsTerminalRouter = express.Router()
windowsTerminalRouter.get("/", async (req, res) => {
    const UPSTREAM_API = "https://store.rg-adguard.net/api/GetFiles";
    // `9N0DX20HK701` refers to:
    // https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-us&gl=US
    const BODY = `type=ProductId&url=9N0DX20HK701&ring=Retail&lang=en-US`;

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
        const urlMatch = text.match(new RegExp(/"(?<url>http:\/\/t.+?)"/, "g"));
        const nameMatch = text.match(new RegExp(/(?<name>Microsoft.Windows.+?rminal_(?<version>[\d.]+)_neutral_~_8wekyb3d8bbwe.msixbundle)/, "g"));
        const versionMatch = text.match(new RegExp(/_(?<version>[\d.]+)_/, "g"));
        const hashMatch = text.match(new RegExp(/(?<sha1>[a-fA-F0-9]{40})/, "g"));
        if (text) {
            const url = urlMatch![10].replaceAll("\"", "");
            const name = nameMatch![2];
            const version = versionMatch![21].replaceAll(/_|~/g, "");
            const hash = hashMatch![21];

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
                })
            );
        }
    }

    return res.status(500).send(
        JSON.stringify({
            message: "couldn't process your request"
        })
    );
})