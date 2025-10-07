/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type LogoutSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function LogoutSvgrepoComSvgIcon(props: LogoutSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 -.5 25 25"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "M11.75 9.874a.75.75 0 0 0 1.5 0zM13.25 4a.75.75 0 0 0-1.5 0zM9.81 6.662a.75.75 0 0 0-.62-1.366zM5.5 12.16l-.75-.004v.013zm7 6.84.009-.75h-.018zm7-6.84.75.009v-.013zm-3.69-6.864a.75.75 0 1 0-.62 1.366zm-2.56 4.578V4h-1.5v5.874zM9.19 5.296a7.58 7.58 0 0 0-4.44 6.86l1.5.008a6.08 6.08 0 0 1 3.56-5.502zM4.75 12.17a7.67 7.67 0 0 0 7.759 7.581l-.018-1.5a6.17 6.17 0 0 1-6.241-6.099zm7.741 7.581a7.67 7.67 0 0 0 7.759-7.581l-1.5-.018a6.17 6.17 0 0 1-6.241 6.099zm7.759-7.594a7.58 7.58 0 0 0-4.44-6.86l-.62 1.366a6.08 6.08 0 0 1 3.56 5.502z"
        }
      ></path>
    </svg>
  );
}

export default LogoutSvgrepoComSvgIcon;
/* prettier-ignore-end */
