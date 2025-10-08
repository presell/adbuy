/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LeadsProductSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LeadsProductSvgIcon(props: LeadsProductSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 35 35"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect
        width={"34.5"}
        height={"34.5"}
        x={".25"}
        y={".25"}
        fill={"#46C775"}
        stroke={"#104123"}
        strokeWidth={".5"}
        rx={"8.75"}
      ></rect>

      <path
        stroke={"#104123"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={"M19 23v-8m5 8V11M9 9v16a2 2 0 0 0 2 2h16m-13-4v-3"}
      ></path>
    </svg>
  );
}

export default LeadsProductSvgIcon;
/* prettier-ignore-end */
