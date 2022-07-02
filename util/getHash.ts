import { downloadFromUrl } from "./downloadFromUrl";
import crypto from "crypto"
import fs from "fs"


export async function getHash(url: string, fileName: string, data: any) {
    try {
        const hash = crypto.createHash("sha256")
        await downloadFromUrl(url, "tmp")
        const file = fs.readFileSync(`tmp/${fileName}`)
        hash.update(file);
        const fileHash = hash.digest("hex")
        fs.unlink(`tmp/${fileName}`, (err) => {
            if (err) throw err
        })
        data.steamless = fileHash
        fs.writeFile("./hashTable.json", JSON.stringify(data), err => {
            if (err) {
                console.log(err)
            }
        })
    } catch (error) {
        console.log(error);
    }
}