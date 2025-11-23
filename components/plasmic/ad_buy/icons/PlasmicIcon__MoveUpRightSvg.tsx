/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type MoveUpRightSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function MoveUpRightSvgIcon(props: MoveUpRightSvgIconProps) {
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
        "lucide lucide-move-up-right-icon lucide-move-up-right"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M13 5h6v6m0-6L5 19"}></path>
    </svg>
  );
}

export default MoveUpRightSvgIcon;
/* prettier-ignore-end */
