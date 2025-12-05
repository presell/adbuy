/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ClockSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ClockSvgIcon(props: ClockSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 717 717"}
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
          "M358.333 50C188.046 50 50 188.046 50 358.333s138.046 308.334 308.333 308.334S666.667 528.62 666.667 358.333 528.62 50 358.333 50M0 358.333C0 160.431 160.431 0 358.333 0c197.904 0 358.334 160.431 358.334 358.333 0 197.904-160.43 358.334-358.334 358.334C160.431 716.667 0 556.237 0 358.333M358.333 200c13.807 0 25 11.193 25 25v122.977l76.01 76.013c9.764 9.763 9.764 25.59 0 35.353s-25.59 9.764-35.353 0l-83.333-83.333a25 25 0 0 1-7.324-17.677V225c0-13.807 11.194-25 25-25"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default ClockSvgIcon;
/* prettier-ignore-end */
