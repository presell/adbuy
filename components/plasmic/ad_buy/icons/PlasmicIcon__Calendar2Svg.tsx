/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Calendar2SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Calendar2SvgIcon(props: Calendar2SvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      strokeWidth={"2"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-calendar-icon lucide-calendar"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M8 2v4m8-4v4"}></path>

      <rect width={"18"} height={"18"} x={"3"} y={"4"} rx={"2"}></rect>

      <path d={"M3 10h18"}></path>
    </svg>
  );
}

export default Calendar2SvgIcon;
/* prettier-ignore-end */
