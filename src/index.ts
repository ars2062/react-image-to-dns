import { Plugin } from 'rollup'
import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { basename, dirname } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

const ImageExtensions = ["apng", "avif", "gif", "jpeg", "png", "svg", "webp", "bmp", "ico", "tiff"] as const

export interface IOptions {
    exclude?: FilterPattern,
    extensions?: typeof ImageExtensions[number][]
}

export default function image(options: IOptions = { extensions: [...ImageExtensions] }): Plugin {
    const { exclude, extensions } = options
    const filter = createFilter(`**/*.{${extensions?.join(', ')}}`, exclude)
    const images: string[] = []

    return {
        name: 'image-source',
        load(id) {
            if (!filter(id)) {
                return null;
            }
            if (images.indexOf(id) < 0) {
                images.push(id);
                console.log(id);
            }
            return `const img = require('./${basename(id)}'); export default img;`;
        },
        generateBundle(outputOptions) {
            console.log(outputOptions);
            const dir =
                outputOptions.dir || (outputOptions.file && dirname(outputOptions.file)) || './';
            if (!existsSync(dir)) {
                mkdirSync(dir);
            }
            images.forEach(id => {
                writeFileSync(`${dir}/${basename(id)}`, readFileSync(id));
            });
        },

    }
}