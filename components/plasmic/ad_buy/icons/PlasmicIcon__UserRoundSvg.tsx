/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type UserRoundSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function UserRoundSvgIcon(props: UserRoundSvgIconProps) {
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
        "lucide lucide-user-round-icon lucide-user-round"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"12"} cy={"8"} r={"5"}></circle>

      <path d={"M20 21a8 8 0 0 0-16 0"}></path>
    </svg>
  );
}

export default UserRoundSvgIcon;
/* prettier-ignore-end */
