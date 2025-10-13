/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type OpenPanelSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function OpenPanelSvgIcon(props: OpenPanelSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 700 600"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M650 0H50A50 50 0 0 0 0 50v500a49.997 49.997 0 0 0 50 50h600a49.997 49.997 0 0 0 50-50V50a50 50 0 0 0-50-50M50 50h150v500H50zm600 500H250V50h400z"
        }
      ></path>
    </svg>
  );
}

export default OpenPanelSvgIcon;
/* prettier-ignore-end */
