/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PanelSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PanelSvgIcon(props: PanelSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 572 572"}
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
        strokeWidth={"38.095"}
        d={
          "M95.526 19.336H476.48c42.079 0 76.19 34.112 76.19 76.19V476.48c0 42.079-34.111 76.19-76.19 76.19H95.526c-42.078 0-76.19-34.111-76.19-76.19V95.526c0-42.078 34.112-76.19 76.19-76.19"
        }
        clipRule={"evenodd"}
      ></path>

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"38.095"}
        d={"M95.523 438.387V133.625"}
      ></path>
    </svg>
  );
}

export default PanelSvgIcon;
/* prettier-ignore-end */
