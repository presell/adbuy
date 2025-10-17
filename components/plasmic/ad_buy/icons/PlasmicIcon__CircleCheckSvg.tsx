/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CircleCheckSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CircleCheckSvgIcon(props: CircleCheckSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 668 668"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"66.667"}
        d={
          "m200.667 345.11 82.05 88.89 184.616-200M634 334c0 165.687-134.313 300-300 300-165.685 0-300-134.313-300-300C34 168.315 168.315 34 334 34c165.687 0 300 134.315 300 300"
        }
      ></path>
    </svg>
  );
}

export default CircleCheckSvgIcon;
/* prettier-ignore-end */
