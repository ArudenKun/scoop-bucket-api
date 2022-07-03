import got from 'got';
import hasha from "hasha"
import { HashesDB } from "../model/hashes"
import { log } from './logger';

export async function getHash(url: string, name: string, version: string) {

    try {
        const data = await HashesDB.findOne({ Name: name, Version: version })
        if (!data) {
            const hash = await Hasher(url)
            await HashesDB.create({
                Name: name,
                Version: version,
                Hash: hash
            })
            return hash
        }

        if (data.Version != version) {
            const hash = await Hasher(url)
            data.updateOne({
                Name: name,
                Version: version,
                Hash: hash
            },
                {
                    upsert: true

                })
            return hash
        }
        return data.Hash
    } catch (error) {
        log.error(error)
    }
}

async function Hasher(url: string | URL) {
    return await hasha.fromStream(got.stream(url), { algorithm: "sha256" });
}