/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PersonSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PersonSvgrepoComSvgIcon(props: PersonSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 24 24"}
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
          "M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4m2 4c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2m4 10c-.2-.71-3.3-2-6-2-2.69 0-5.77 1.28-6 2zM4 18c0-2.66 5.33-4 8-4s8 1.34 8 4v2H4z"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default PersonSvgrepoComSvgIcon;
/* prettier-ignore-end */
