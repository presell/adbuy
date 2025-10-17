/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ExitSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ExitSvgIcon(props: ExitSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 0 14 14"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g
        stroke={"#000"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"2"}
        clipPath={"url(#a)"}
      >
        <path d={"M13 1 1 13M1 1l12 12"}></path>
      </g>

      <defs>
        <clipPath id={"a"}>
          <path fill={"#fff"} d={"M0 0h14v14H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default ExitSvgIcon;
/* prettier-ignore-end */
