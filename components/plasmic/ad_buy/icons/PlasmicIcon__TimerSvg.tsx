/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TimerSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TimerSvgIcon(props: TimerSvgIconProps) {
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
        "lucide lucide-timer-icon lucide-timer"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M10 2h4m-2 12 3-3"}></path>

      <circle cx={"12"} cy={"14"} r={"8"}></circle>
    </svg>
  );
}

export default TimerSvgIcon;
/* prettier-ignore-end */
