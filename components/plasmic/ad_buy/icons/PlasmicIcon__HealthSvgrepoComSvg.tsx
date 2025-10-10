/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HealthSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function HealthSvgrepoComSvgIcon(props: HealthSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 32 32"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M29.125 10.375h-7.5v-7.5A1.874 1.874 0 0 0 19.75 1h-7.5c-1.036 0-1.875.84-1.875 1.875v7.5h-7.5c-1.036 0-1.875.84-1.875 1.875v7.5c0 1.036.84 1.875 1.875 1.875h7.5v7.5c0 1.036.84 1.875 1.875 1.875h7.5c1.036 0 1.875-.84 1.875-1.875v-7.5h7.5A1.875 1.875 0 0 0 31 19.75v-7.5c0-1.036-.84-1.875-1.875-1.875"
        }
      ></path>
    </svg>
  );
}

export default HealthSvgrepoComSvgIcon;
/* prettier-ignore-end */
