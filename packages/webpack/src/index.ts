import { Compiler } from "webpack";
import { ImageExtensions, IOptions } from "react-image-to-dns-core";

export default class ImageToDNSPlugin {
  options: IOptions;
  constructor(options: IOptions = {}) {
    Object.assign(options, {
      extensions: ImageExtensions,
      cdnPath: "/cdn",
      breakpoints: [320, 375, 425, 768, 1024, 1440],
      sizeOptimization: 80,
    });
    this.options = options;
  }
  apply(compiler: Compiler) {
    // console.log(compiler);
    compiler.hooks.assetEmitted.tapAsync(
      "ImageToDNSPlugin",
      (path, info, cb) => {
        console.log(path, info);

        cb();
      }
    );
    compiler.hooks.done?.tapAsync("ImageToDNSPlugin", (stats, cb) => {
      console.log(stats);
      cb();
    });
  }
}
