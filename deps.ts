export { alasRouter } from "./routes/alas"
export { messengerRouter } from "./routes/messenger"
export { noxPlayerRouter } from "./routes/noxplayer"
export { steamlessRouter } from "./routes/steamless"
export { windowsTerminalRouter } from "./routes/windows_terminal"

import crypto from "crypto"
export const hasher = crypto.createHash("sha256")