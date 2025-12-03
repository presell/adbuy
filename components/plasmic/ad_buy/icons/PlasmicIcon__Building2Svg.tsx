/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Building2SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Building2SvgIcon(props: Building2SvgIconProps) {
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
        "lucide lucide-building2-icon lucide-building-2"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Zm0-10H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4m-4 4h4m-4 4h4m-4 4h4"
        }
      ></path>
    </svg>
  );
}

export default Building2SvgIcon;
/* prettier-ignore-end */
