import * as fs from "fs";
import hash from "../hashTable.json"

export async function jsonRead(callback: Function) {
    fs.readFile("./hashTable.json", "utf-8", (err, jsonData) => {
        if (err) return callback && callback(err)

        try {
            const data = JSON.parse(jsonData)
            return callback && callback(null, data)
        } catch (err) {
            return callback && callback(err)
        }
    })
}