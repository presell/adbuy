/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ScaleSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ScaleSvgIcon(props: ScaleSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 568 451"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M292.33.667c18.41 0 16.668 14.924 16.668 33.333l1.139 36.021 193.228 54.433-8.064 32.343-21.015-5.239L567.33 334c0 32.217-53.104 58.334-108.332 58.334-55.229 0-108.334-26.117-108.334-58.334l84.794-192.123-123.974-30.911 9.771 290.744c64.369 4.712 112.743 24.841 112.743 48.956H150.664c0-24.115 48.374-44.244 112.743-48.956l11.421-299.883-140.145-34.942L217.33 259c0 32.217-53.104 58.334-108.332 58.334C53.769 317.334.664 291.217.664 259l95.19-201.796-21.014-5.24 8.064-32.343 192.733 45.965.027-31.586c0-18.41-1.743-33.333 16.666-33.333M528.409 334 467.33 182.825V334zm-138.824 0h61.079V182.825zm-211.176-74.999L117.33 107.826v151.175zm-138.824 0h61.079V107.825z"
        }
      ></path>
    </svg>
  );
}

export default ScaleSvgIcon;
/* prettier-ignore-end */
