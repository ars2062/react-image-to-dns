import { appendFileSync, createReadStream, createWriteStream } from "fs"
import { rm, writeFile } from "fs/promises"
import { basename, dirname, join } from "path"
import { NormalizedOutputOptions } from "rollup"
import sharp, { Metadata } from "sharp"
import { Stream } from "stream"
import { IOptions } from "."
import { writeStreamToFile } from "./processing"

export const getOutputPath = (buildOptions: NormalizedOutputOptions, cdnPath: IOptions['cdnPath']) => {
    return (buildOptions.dir || (buildOptions.file && dirname(buildOptions.file)) || './') + cdnPath
}

export const getMetadata = (file: string): Promise<Metadata & { stream: Stream }> => {
    const stream = createReadStream(file)
    return new Promise((resolve, reject) => {
        const pipeline = sharp();
        pipeline.metadata().then((res) => resolve({ ...res, stream })).catch(reject);
        stream.pipe(pipeline);
    });
}

export const log = (message: any) => {
    appendFileSync(__dirname + '/out.log', message + '\n')
}

export const copyImages = async (images: Buffer[], breakpoints: number[], originalPath: string, buildOptions: NormalizedOutputOptions, cdnPath: IOptions['cdnPath']) => {
    const dir = getOutputPath(buildOptions, cdnPath);
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const breakpoint = breakpoints[i];
        const [name, ext] = basename(originalPath).split('.')

        createWriteStream(join(dir, `${name}-${breakpoint}.${ext}`)).write(image)
    }
}