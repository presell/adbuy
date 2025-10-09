/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PlusSvg2IconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PlusSvg2Icon(props: PlusSvg2IconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      preserveAspectRatio={"xMinYMin"}
      viewBox={"-4.5 -4.5 24 24"}
      height={"1em"}
      style={{
        fill: "currentcolor",

        ...(style || {})
      }}
      className={classNames("plasmic-default__svg", className)}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M8.9 6.9v-5a1 1 0 10-2 0v5h-5a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2z"
        }
      ></path>
    </svg>
  );
}

export default PlusSvg2Icon;
/* prettier-ignore-end */
