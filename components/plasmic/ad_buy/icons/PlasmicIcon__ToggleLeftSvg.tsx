/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ToggleLeftSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ToggleLeftSvgIcon(props: ToggleLeftSvgIconProps) {
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
        "lucide lucide-toggle-left-icon lucide-toggle-left"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"9"} cy={"12"} r={"3"}></circle>

      <rect width={"20"} height={"14"} x={"2"} y={"5"} rx={"7"}></rect>
    </svg>
  );
}

export default ToggleLeftSvgIcon;
/* prettier-ignore-end */
