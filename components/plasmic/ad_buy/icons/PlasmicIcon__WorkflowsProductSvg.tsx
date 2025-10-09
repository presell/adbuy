/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type WorkflowsProductSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function WorkflowsProductSvgIcon(props: WorkflowsProductSvgIconProps) {
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
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeWidth={".5"}
        rx={"8.75"}
      ></rect>

      <path
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={
          "M15 8h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"
        }
      ></path>

      <path fill={"#FB923C"} d={"M13 16v4a2 2 0 0 0 2 2h4"}></path>

      <path
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={"M13 16v4a2 2 0 0 0 2 2h4"}
      ></path>

      <path
        fill={"#FB923C"}
        stroke={"#7C2D12"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"3"}
        d={
          "M25 18h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"
        }
      ></path>
    </svg>
  );
}

export default WorkflowsProductSvgIcon;
/* prettier-ignore-end */
