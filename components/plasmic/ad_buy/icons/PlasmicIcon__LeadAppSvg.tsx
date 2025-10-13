/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LeadAppSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LeadAppSvgIcon(props: LeadAppSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 534 534"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillRule={"evenodd"}
        d={
          "M267.003.336c-73.667 0-133.334 59.667-133.334 133.333 0 73.667 59.667 133.334 133.334 133.334 73.666 0 133.333-59.667 133.333-133.334C400.336 60.003 340.669.336 267.003.336m66.666 133.333c0-36.666-30-66.666-66.666-66.666-36.667 0-66.667 30-66.667 66.666 0 36.667 30 66.667 66.667 66.667 36.666 0 66.666-30 66.666-66.667m133.334 333.334c-6.667-23.667-110-66.667-200-66.667-89.667 0-192.334 42.667-200 66.667zm-466.667 0c0-88.667 177.667-133.334 266.667-133.334s266.666 44.667 266.666 133.334v66.666H.336z"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default LeadAppSvgIcon;
/* prettier-ignore-end */
