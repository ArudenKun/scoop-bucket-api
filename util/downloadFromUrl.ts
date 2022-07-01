import { promisify } from 'util';
import stream from 'stream';
import fs from 'fs';
import path from "path"
import got from 'got/dist/source';

const pipeline = promisify(stream.pipeline);

export async function downloadFromUrl(url: string, outputPath: string) {
    const fileName = path.basename(url)
    await pipeline(
        got.stream(url),
        fs.createWriteStream(`${outputPath}/${fileName}`)
    );
}
