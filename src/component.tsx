import React, { ImgHTMLAttributes } from "react";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  lazy?: boolean;
}
const Component = (props: ImageProps) => {
  const { lazy, ...rest } = props;
  const src = "{{FILE_URL}}";
  return (
    <picture>
      {/*{{BREAKPOINTS}}*/}
      <img src={src} {...rest} />
    </picture>
  );
};

export default Component;
