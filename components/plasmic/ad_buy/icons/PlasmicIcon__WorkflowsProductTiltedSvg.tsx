/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WorkflowsProductTiltedSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function WorkflowsProductTiltedSvgIcon(
  props: WorkflowsProductTiltedSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 42 42"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect
        width={"34.5"}
        height={"34.5"}
        x={"6.877"}
        y={".293"}
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeWidth={".5"}
        rx={"8.75"}
        transform={"rotate(11 6.877 .293)"}
      ></rect>

      <path
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={
          "m19.874 10.715-3.926-.763a2 2 0 0 0-2.345 1.582l-.764 3.926a2 2 0 0 0 1.582 2.345l3.927.763a2 2 0 0 0 2.345-1.582l.763-3.926a2 2 0 0 0-1.582-2.345"
        }
      ></path>

      <path
        fill={"#FB923C"}
        d={"m16.383 18.188-.763 3.926a2 2 0 0 0 1.581 2.345l3.927.763"}
      ></path>

      <path
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={"m16.383 18.188-.763 3.926a2 2 0 0 0 1.581 2.345l3.927.763"}
      ></path>

      <path
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={
          "m27.78 22.442-3.926-.764a2 2 0 0 0-2.345 1.582l-.763 3.927a2 2 0 0 0 1.581 2.345l3.927.763a2 2 0 0 0 2.345-1.582l.763-3.926a2 2 0 0 0-1.582-2.345"
        }
      ></path>
    </svg>
  );
}

export default WorkflowsProductTiltedSvgIcon;
/* prettier-ignore-end */
