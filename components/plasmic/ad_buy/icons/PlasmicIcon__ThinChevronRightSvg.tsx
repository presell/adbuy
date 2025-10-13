/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ThinChevronRightSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ThinChevronRightSvgIcon(props: ThinChevronRightSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 200 368"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
        strokeWidth={"33.333"}
        d={"m16.664 17.336 166.667 166.667L16.664 350.669"}
      ></path>
    </svg>
  );
}

export default ThinChevronRightSvgIcon;
/* prettier-ignore-end */
