import { createWriteStream } from "fs";
import { readFile } from "fs/promises";
import sharp, { ResizeOptions } from "sharp";
// import { createHash } from 'crypto';
import { Stream } from "stream";
import { IOptions } from ".";
import { getMetadata } from "./utils";

export const writeStreamToFile = (stream: Stream, path: string) =>
  new Promise((resolve, reject) => {
    const writeStream = createWriteStream(path);
    stream.on("error", reject);
    stream.pipe(writeStream);
    writeStream.on("close", resolve);
    writeStream.on("error", reject);
  });

const breakpointSmallerThan = (
  breakpoint: number,
  width: number,
  height: number
) => {
  return breakpoint < width || breakpoint < height;
};

const resizeFileTo = async (image: Buffer, options: ResizeOptions) => {
  return await sharp(image).resize(options).toBuffer();
};

export const generateOptimizedImages = async (
  image: string,
  breakpoints: number[],
  sizeOptimization: IOptions["sizeOptimization"]
) => {
  console.log(image);

  const { width = 0, height = 0 /*, format*/ } = await getMetadata(image);
  // @ts-ignore
  const buffer = await sharp(image)
    .jpeg({ quality: sizeOptimization })
    .toBuffer();

  const res: Buffer[] = [];
  console.log(breakpoints);

  for (let i = 0; i < breakpoints.length; i++) {
    const breakpoint = breakpoints[i];
    if (breakpointSmallerThan(breakpoint, width, height)) {
      res.push(
        await resizeFileTo(buffer, {
          height: breakpoint,
          width: breakpoint,
          fit: "inside",
        })
      );
    } else {
      res.push(await readFile(image));
    }
  }
  return res;
};
