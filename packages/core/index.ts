import { FormatEnum } from "sharp";
import { FilterPattern } from "@rollup/pluginutils";

export interface IOptions {
  exclude?: FilterPattern;
  extensions?: TImageExtension[];
  cdnPath?: string;
  breakpoints?: number[];
  sizeOptimization?: number;
}

export const ImageExtensions = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "tiff",
  "svg",
  "gif",
] as (keyof FormatEnum)[];
export type TImageExtension = typeof ImageExtensions[number];

export const FORMATS_TO_OPTIMIZE: TImageExtension[] = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "tiff",
];

export * from "./processing";
export * from "./utils";
