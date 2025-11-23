/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EditActiveSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function EditActiveSvgIcon(props: EditActiveSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 8 8"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={"M6 0L5 1l2 2 1-1-2-2zM4 2L0 6v2h2l4-4-2-2z"}
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default EditActiveSvgIcon;
/* prettier-ignore-end */
