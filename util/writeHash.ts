import fs from "fs"

export async function writeHash(json: any) {
    fs.writeFile("./hashes.json", JSON.stringify(json), err => {
        if (err) {
            console.log(err)
        }
    })
}