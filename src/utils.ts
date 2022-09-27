import { BinaryLike, createHash } from "crypto"
import { appendFileSync, createReadStream } from "fs"
import { dirname } from "path"
import { NormalizedOutputOptions } from "rollup"
import sharp, { Metadata } from "sharp"
import { IOptions } from "."

export const getOutputPath = (buildOptions: NormalizedOutputOptions, cdnPath: IOptions['cdnPath']) => {
    return (buildOptions.dir || (buildOptions.file && dirname(buildOptions.file)) || './') + cdnPath
}

export const getMetadata = (file: string): Promise<Metadata> => {
    const stream = createReadStream(file)
    return new Promise((resolve, reject) => {
        const pipeline = sharp();
        pipeline.metadata().then(resolve).catch(reject);
        stream.pipe(pipeline);
    });
}

export function generateHash(bin: BinaryLike) {
    const hash = createHash("sha1");
    hash.update(bin);
    return hash.digest("base64url").substring(0, 4);
}

export function log(message: any) {
    appendFileSync(__dirname + '/out.log', message + '\n')
}