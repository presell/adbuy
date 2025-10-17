/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EnterSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function EnterSvgIcon(props: EnterSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 600 400"}
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
          "M566.669 33.336v40c0 56.005 0 84.007-10.9 105.4a99.98 99.98 0 0 1-43.7 43.7c-21.393 10.9-49.393 10.9-105.4 10.9H33.336m0 0 133.333-133.333M33.336 233.336l133.333 133.333"
        }
      ></path>
    </svg>
  );
}

export default EnterSvgIcon;
/* prettier-ignore-end */
