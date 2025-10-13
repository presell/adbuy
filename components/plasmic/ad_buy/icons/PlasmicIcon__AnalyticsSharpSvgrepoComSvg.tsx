/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AnalyticsSharpSvgrepoComSvgIconProps =
  React.ComponentProps<"svg"> & {
    title?: string;
  };

export function AnalyticsSharpSvgrepoComSvgIcon(
  props: AnalyticsSharpSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      viewBox={"0 0 512 512"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M450 128a46 46 0 0 0-44.11 59l-71.37 71.36a45.88 45.88 0 0 0-29 0l-52.91-52.91a46 46 0 1 0-89.12 0L75 293.88A46.08 46.08 0 1 0 106.11 325l87.37-87.36a45.85 45.85 0 0 0 29 0l52.92 52.92a46 46 0 1 0 89.12 0L437 218.12A46 46 0 1 0 450 128"
        }
      ></path>
    </svg>
  );
}

export default AnalyticsSharpSvgrepoComSvgIcon;
/* prettier-ignore-end */
