"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFromUrl = void 0;
const util_1 = require("util");
const stream_1 = __importDefault(require("stream"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const source_1 = __importDefault(require("got/dist/source"));
const pipeline = (0, util_1.promisify)(stream_1.default.pipeline);
async function downloadFromUrl(url, outputPath) {
    const fileName = path_1.default.basename(url);
    await pipeline(source_1.default.stream(url), fs_1.default.createWriteStream(`${outputPath}/${fileName}`));
}
exports.downloadFromUrl = downloadFromUrl;
