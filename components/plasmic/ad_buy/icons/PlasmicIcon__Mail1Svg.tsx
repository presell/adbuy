/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Mail1SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Mail1SvgIcon(props: Mail1SvgIconProps) {
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
        "lucide lucide-mail-icon lucide-mail"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}></path>

      <rect width={"20"} height={"16"} x={"2"} y={"4"} rx={"2"}></rect>
    </svg>
  );
}

export default Mail1SvgIcon;
/* prettier-ignore-end */
