export { alasRouter } from "./routes/alas"
export { messengerRouter } from "./routes/messenger"
export { noxPlayerRouter } from "./routes/noxplayer"
export { steamlessRouter } from "./routes/steamless"
export { windowsTerminalRouter } from "./routes/windows_terminal"

import fs from "fs"

const jsonData = fs.readFileSync("./hashes.json", "utf-8")
export const hashes = JSON.parse(jsonData)