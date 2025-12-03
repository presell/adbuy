/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type StarSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function StarSvgIcon(props: StarSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 667 667"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M238.439 113.613C280.66 37.871 301.77 0 333.333 0s52.674 37.87 94.894 113.612l10.923 19.596c12 21.523 17.997 32.285 27.353 39.386 9.354 7.1 21 9.736 44.3 15.008l21.214 4.799c81.986 18.551 122.983 27.826 132.736 59.19 9.754 31.362-18.193 64.046-74.09 129.406l-14.46 16.91c-15.883 18.573-23.826 27.86-27.4 39.35-3.57 11.49-2.37 23.88.03 48.663l2.187 22.56c8.45 87.207 12.677 130.81-12.857 150.193-25.536 19.384-63.92 1.71-140.686-33.633l-19.86-9.147c-21.814-10.043-32.72-15.066-44.284-15.066s-22.47 5.023-44.283 15.066l-19.86 9.147c-76.767 35.343-115.151 53.017-140.685 33.633-25.534-19.383-21.309-62.986-12.858-150.193l2.186-22.56c2.401-24.783 3.602-37.173.029-48.663s-11.514-20.777-27.398-39.35l-14.46-16.91c-55.896-65.36-83.843-98.044-74.09-129.406 9.753-31.364 50.748-40.639 132.737-59.19l21.212-4.799c23.299-5.272 34.948-7.908 44.302-15.008 9.353-7.101 15.353-17.863 27.351-39.386z"
        }
      ></path>
    </svg>
  );
}

export default StarSvgIcon;
/* prettier-ignore-end */
