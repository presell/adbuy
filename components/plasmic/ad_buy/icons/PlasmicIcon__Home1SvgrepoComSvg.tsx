/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type Home1SvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function Home1SvgrepoComSvgIcon(props: Home1SvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 16 16"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillRule={"evenodd"}
        d={"M8 0 0 6v2h1v7h3v-5h3v5h8V8h1V6l-2-1.5V1h-3v1.25zm1 10h3v3H9z"}
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default Home1SvgrepoComSvgIcon;
/* prettier-ignore-end */
