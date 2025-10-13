/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type DocumentSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function DocumentSvgIcon(props: DocumentSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 600 734"}
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
          "M100 .336c-55.228 0-100 44.772-100 100v533.333c0 55.23 44.772 100 100 100h400c55.23 0 100-44.77 100-100V261.284a100 100 0 0 0-29.29-70.711L409.763 29.625a100 100 0 0 0-70.71-29.29zm-33.333 100c0-18.41 14.924-33.333 33.333-33.333h200v166.666c0 36.819 29.847 66.667 66.667 66.667h166.666v333.333c0 18.41-14.923 33.334-33.333 33.334H100c-18.41 0-33.333-14.924-33.333-33.334zm452.86 133.333-152.86-152.86v152.86z"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default DocumentSvgIcon;
/* prettier-ignore-end */
