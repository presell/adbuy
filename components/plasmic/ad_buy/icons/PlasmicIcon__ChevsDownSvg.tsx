/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChevsDownSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChevsDownSvgIcon(props: ChevsDownSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 800 800"}
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
          "M400.003 533.332c8.84 0 17.32-3.512 23.57-9.763l233.333-233.334c13.017-13.016 13.017-34.123 0-47.14-13.017-13.016-34.123-13.016-47.14 0L400.003 452.858 190.24 243.095c-13.018-13.016-34.123-13.016-47.141 0-13.017 13.017-13.017 34.124 0 47.14l233.334 233.334a33.33 33.33 0 0 0 23.57 9.763"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default ChevsDownSvgIcon;
/* prettier-ignore-end */
