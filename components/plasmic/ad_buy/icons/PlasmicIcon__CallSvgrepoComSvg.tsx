/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CallSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CallSvgrepoComSvgIcon(props: CallSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlSpace={"preserve"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 512 512"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "m426.7 453.8-38.1-79.1c-8.2-16.9-18.8-29.2-37.1-21.7l-36.1 13.4c-28.9 13.4-43.3 0-57.8-20.2l-65-147.9c-8.2-16.9-3.9-32.8 14.4-40.3l50.5-20.2c18.3-7.6 15.4-23.4 7.2-40.3l-43.3-80.6c-8.2-16.9-25-21-43.3-13.5-36.6 15.1-66.9 38.8-86.6 73.9-24 42.9-12 102.6-7.2 127.7s21.6 69.1 43.3 114.2c21.7 45.2 40.7 80.7 57.8 100.8 17 20.1 57.8 75.1 108.3 87.4 41.4 10 86.1 1.6 122.7-13.5 18.4-7.2 18.4-23.1 10.3-40.1"
        }
      ></path>
    </svg>
  );
}

export default CallSvgrepoComSvgIcon;
/* prettier-ignore-end */
