import { Plugin } from 'rollup'
import { transformWithEsbuild } from 'vite'
import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { basename, join } from 'path'
import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { getOutputPath } from './utils'
const ImageExtensions = ["apng", "avif", "gif", "jpeg", "png", "svg", "webp", "bmp", "ico", "tiff"] as const

export interface IOptions {
    exclude?: FilterPattern,
    extensions?: typeof ImageExtensions[number][],
    cdnPath?: string,
    widths?: number[]
}

export default function image(options: IOptions = {}): Plugin {
    const {
        exclude,
        extensions = ImageExtensions,
        cdnPath = "/cdn",
        widths = [
            320,
            375,
            425,
            768,
            1024,
            1440
        ]
    } = options
    const filter = createFilter(`**/*.{${extensions?.join(',')}}`, exclude)
    const images: string[] = []
    return {
        name: 'image-source',
        async transform(_, id) {
            if (!filter(id)) return null;
            if (!images.includes(id)) images.push(id);
            if (process.env.NODE_ENV === 'development') {
                const dir = join('.', cdnPath)
                if (!existsSync(dir)) mkdirSync(dir)
                copyFileSync(id, join(dir, basename(id)))
            }
            const [name, extension] = basename(id).split('.');
            const componentSrc = await import('./component').then(res => res.default) as unknown as string
            const component = componentSrc
                .replace(/Component/g, name)
                .replace('{{FILE_URL}}', `${cdnPath}/${name}.${extension}`)
                .replace('{/*{{BREAKPOINTS}}*/}', `
                    ${widths.map(width => `<source media='(min-width: ${width}px)' src='${cdnPath}/${name}-${width}.${extension}'/>`).join('\n')}
                `)
            const res = await transformWithEsbuild(component, id, {
                loader: 'tsx',
            })
            return {
                code: res.code,
                map: null
            }
        },
        generateBundle(buildOptions) {
            const dir = getOutputPath(buildOptions, cdnPath);
            if (!existsSync(dir)) mkdirSync(dir)
            images.forEach((image) => {
                copyFileSync(image, join(dir, basename(image)))
            })
        },
    }
}
