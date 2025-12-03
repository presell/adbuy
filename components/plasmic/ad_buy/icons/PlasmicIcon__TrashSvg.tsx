/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type TrashSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function TrashSvgIcon(props: TrashSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 422 600"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M121.875 0v78.125H0V125h421.875V78.125H300V0zM150 28.125h121.875v50H150zm-123.44 125L73.6 600h274.678l47.038-446.875zm97.402 20.906 1 14.031 25 350 1.005 14.026-28.056 2.004-1-14.031-25-350-1.005-14.025zm173.951 0 28.054 2.007-1.004 14.026-25 350-1.001 14.031-28.056-2.006 1.005-14.027 25-350 1-14.031zM196.875 175H225v378.125h-28.125z"
        }
      ></path>
    </svg>
  );
}

export default TrashSvgIcon;
/* prettier-ignore-end */
