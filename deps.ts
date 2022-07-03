export { alasRouter } from "./routes/alas"
export { messengerRouter } from "./routes/messenger"
export { noxPlayerRouter } from "./routes/noxplayer"
export { steamlessRouter } from "./routes/steamless"
export { windowsTerminalRouter } from "./routes/windows_terminal"

import fs from "fs"
import path from "path"

// const jsonData = fs.readFileSync("./hashes.json", "utf-8")
// export const hashes = JSON.parse(jsonData)

const file = path.join(process.cwd(), '.', 'hashes.json');
const json = fs.readFileSync(file, 'utf8');
export const hashes = JSON.parse(json)