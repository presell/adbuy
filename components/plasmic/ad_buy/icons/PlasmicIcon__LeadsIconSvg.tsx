/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LeadsIconSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LeadsIconSvgIcon(props: LeadsIconSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 22 22"}
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
        strokeWidth={"3"}
        d={"M12 16V8m5 8V4M2 2v16a2 2 0 0 0 2 2h16M7 16v-3"}
      ></path>
    </svg>
  );
}

export default LeadsIconSvgIcon;
/* prettier-ignore-end */
