/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type DownloadIconSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function DownloadIconSvgIcon(props: DownloadIconSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 650 650"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M343.448 475.203a25 25 0 0 1-36.9 0L173.214 329.37c-9.317-10.19-8.609-26.003 1.581-35.32s26.003-8.61 35.32 1.58l89.883 98.31V25c0-13.807 11.193-25 25-25 13.806 0 25 11.193 25 25v368.94l89.883-98.31c9.317-10.19 25.13-10.897 35.32-1.58s10.897 25.13 1.58 35.32z"
        }
      ></path>

      <path
        fill={"currentColor"}
        d={
          "M50 425c0-13.807-11.193-25-25-25S0 411.193 0 425v1.83c0 45.587-.001 82.33 3.884 111.23 4.034 30.003 12.664 55.263 32.728 75.327 20.064 20.066 45.326 28.696 75.33 32.73C140.841 650 177.585 650 223.171 650H426.83c45.587 0 82.33 0 111.23-3.883 30.003-4.034 55.263-12.664 75.33-32.73 20.063-20.064 28.693-45.324 32.727-75.327C650 509.16 650 472.417 650 426.83V425c0-13.807-11.193-25-25-25s-25 11.193-25 25c0 47.847-.053 81.217-3.437 106.397-3.29 24.46-9.303 37.41-18.53 46.636s-22.176 15.24-46.636 18.53C506.217 599.947 472.847 600 425 600H225c-47.847 0-81.218-.053-106.396-3.437-24.459-3.29-37.412-9.303-46.637-18.53s-15.24-22.176-18.529-46.636C50.053 506.217 50 472.847 50 425"
        }
      ></path>
    </svg>
  );
}

export default DownloadIconSvgIcon;
/* prettier-ignore-end */
