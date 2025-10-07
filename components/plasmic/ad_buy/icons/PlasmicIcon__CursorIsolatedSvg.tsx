/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type CursorIsolatedSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function CursorIsolatedSvgIcon(props: CursorIsolatedSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 23 23"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M21.044 9.538c.729-.284 1.093-.426 1.196-.627a.59.59 0 00-.008-.55c-.108-.198-.476-.33-1.212-.594L2.243 1.041C1.64.826 1.339.718 1.143.786a.59.59 0 00-.365.365c-.068.197.04.498.257 1.1l6.751 18.768c.265.736.397 1.104.595 1.211a.59.59 0 00.551.007c.2-.103.342-.467.625-1.196.857-2.209 1.6-6.55 3.247-8.236 1.615-1.653 6.075-2.423 8.24-3.267z"
        }
        fill={"currentColor"}
      ></path>
    </svg>
  );
}

export default CursorIsolatedSvgIcon;
/* prettier-ignore-end */
