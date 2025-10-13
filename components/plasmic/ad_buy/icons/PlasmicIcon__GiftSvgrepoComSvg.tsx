/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type GiftSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function GiftSvgrepoComSvgIcon(props: GiftSvgrepoComSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 668 668"}
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
        strokeWidth={"66.667"}
        d={
          "M334 167.333v433.334m0-433.334H216.143c-17.366 0-34.02-7.023-46.299-19.526s-19.177-29.459-19.177-47.14 6.898-34.638 19.177-47.14S198.777 34 216.143 34C307.81 34 334 167.333 334 167.333m0 0h117.857c17.366 0 34.02-7.023 46.3-19.526 12.276-12.502 19.176-29.459 19.176-47.14s-6.9-34.638-19.176-47.14C485.877 41.023 469.223 34 451.857 34 360.19 34 334 167.333 334 167.333M100.667 334h466.666v193.333c0 37.337 0 56.007-7.266 70.267a66.65 66.65 0 0 1-29.134 29.133C516.673 634 498.003 634 460.667 634H207.333c-37.337 0-56.005 0-70.266-7.267a66.66 66.66 0 0 1-29.134-29.133c-7.266-14.26-7.266-32.93-7.266-70.267zm-13.334 0h493.334c18.67 0 28.003 0 35.133-3.633a33.34 33.34 0 0 0 14.567-14.567C634 308.67 634 299.337 634 280.667v-60c0-18.669 0-28.003-3.633-35.133a33.34 33.34 0 0 0-14.567-14.568c-7.13-3.633-16.463-3.633-35.133-3.633H87.333c-18.668 0-28.002 0-35.133 3.633a33.34 33.34 0 0 0-14.567 14.568C34 192.664 34 201.998 34 220.667v60c0 18.67 0 28.003 3.633 35.133A33.34 33.34 0 0 0 52.2 330.367C59.33 334 68.665 334 87.333 334"
        }
      ></path>
    </svg>
  );
}

export default GiftSvgrepoComSvgIcon;
/* prettier-ignore-end */
