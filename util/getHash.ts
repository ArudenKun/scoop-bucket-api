import got from 'got';
import hasha from "hasha"

export async function getHash(url: string) {
    return await hasha.fromStream(got.stream(url), { algorithm: "sha256" });
}