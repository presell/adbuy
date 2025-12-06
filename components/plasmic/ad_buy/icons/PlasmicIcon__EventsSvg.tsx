/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type EventsSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function EventsSvgIcon(props: EventsSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 517 250"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        stroke={"currentColor"}
        strokeLinecap={"round"}
        strokeWidth={"50"}
        d={
          "M25 140.85h46.482c26.198 0 39.297 0 50.352 5.917s18.32 16.816 32.853 38.613l5.326 7.99c14.089 21.133 21.133 31.7 30.683 31.133 9.547-.566 15.294-11.893 26.781-34.546l65.536-129.224c11.944-23.553 17.917-35.33 27.69-35.723 9.77-.393 16.667 10.87 30.464 33.39l21.24 34.68c14.3 23.343 21.446 35.013 32.833 41.393 11.383 6.377 25.07 6.377 52.443 6.377h43.984"
        }
      ></path>
    </svg>
  );
}

export default EventsSvgIcon;
/* prettier-ignore-end */
