import { Plugin } from 'rollup'
import { transformWithEsbuild } from 'vite'
import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { basename, join } from 'path'
import { existsSync, mkdirSync, copyFileSync } from 'fs'
import { copyImages, getMetadata, getOutputPath } from './utils'
import { FormatEnum } from 'sharp'
import { generateOptimizedImages } from './processing'
const ImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'tiff', 'svg', 'gif'] as (keyof FormatEnum)[]
type TImageExtension = typeof ImageExtensions[number]

const FORMATS_TO_OPTIMIZE: TImageExtension[] = ['jpg', 'jpeg', 'png', 'webp', 'tiff'];

export interface IOptions {
    exclude?: FilterPattern,
    extensions?: TImageExtension[],
    cdnPath?: string,
    breakpoints?: number[]
    sizeOptimization?: number
}

export default function image(options: IOptions = {}): Plugin {
    const {
        exclude,
        extensions = ImageExtensions,
        cdnPath = "/cdn",
        breakpoints = [
            320,
            375,
            425,
            768,
            1024,
            1440
        ],
        sizeOptimization = 80
    } = options
    const filter = createFilter(`**/*.{${extensions?.join(',')}}`, exclude)
    const images: string[] = []
    return {
        name: 'vite-plugin-react-image-dns',
        async transform(_, id) {
            if (!filter(id)) return null;
            if (!images.includes(id)) images.push(id);
            if (process.env.NODE_ENV === 'development') {
                const dir = join('.', cdnPath)
                if (!existsSync(dir)) mkdirSync(dir)
                copyFileSync(id, join(dir, basename(id)))
            }
            const [name, ext] = basename(id).split('.');
            const componentSrc = await import('./component.template').then(res => res.default)
            let component = ''
            if (process.env.NODE_ENV === 'production' && FORMATS_TO_OPTIMIZE.includes(ext as keyof FormatEnum)) {
                const FILE_URL = `${cdnPath}/${name}-${breakpoints[breakpoints.length - 1]}.${ext}`;
                const SIZES = `${breakpoints.map(breakpoint => `(min-width: ${breakpoint}px) ${breakpoint}px`).join(', ')}`;
                const SOURCE_SET = `${breakpoints.map(breakpoint => `${cdnPath}/${name}-${breakpoint}.${ext} ${breakpoint}w`).join(', ')}`;
                component = componentSrc
                    .replace(/Component/g, name)
                    .replace('{{FILE_URL}}', FILE_URL)
                    .replace('{{SIZES}}', SIZES)
                    .replace('{{SOURCE_SET}}', SOURCE_SET)
            } else {
                component = componentSrc
                    .replace(/Component/g, name)
                    .replace('{{FILE_URL}}', `${cdnPath}/${name}.${ext}`)
                    .replace('{{SIZES}}', '')
                    .replace('{{SOURCE_SET}}', '')
            }
            const res = await transformWithEsbuild(component, id, {
                loader: 'tsx',
            })
            return {
                code: res.code,
                map: null
            }
        },
        async generateBundle(buildOptions) {
            const dir = getOutputPath(buildOptions, cdnPath);
            if (!existsSync(dir)) mkdirSync(dir)
            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                let format;
                try {
                    const metadata = await getMetadata(image);
                    format = metadata.format;
                    if (!format || !extensions.includes(format)) throw `file "${image}" is not a supported image`
                } catch (e) {
                    throw `file "${image}" is not a supported image`
                }
                if (FORMATS_TO_OPTIMIZE.includes(format)) {
                    const newImages = await generateOptimizedImages(image, breakpoints, sizeOptimization)
                    await copyImages(newImages, breakpoints, image, buildOptions, cdnPath);
                } else
                    copyFileSync(image, join(dir, basename(image)))
            }
            return Promise.resolve()
        },
    }
}
