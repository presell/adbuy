/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ChartColumnIncreasingSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ChartColumnIncreasingSvgIcon(
  props: ChartColumnIncreasingSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      stroke={"currentColor"}
      strokeLinecap={"round"}
      strokeLinejoin={"round"}
      strokeWidth={"2"}
      className={classNames(
        "plasmic-default__svg",
        className,
        "lucide lucide-chart-column-increasing-icon lucide-chart-column-increasing"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path d={"M13 17V9m5 8V5M3 3v16a2 2 0 0 0 2 2h16M8 17v-3"}></path>
    </svg>
  );
}

export default ChartColumnIncreasingSvgIcon;
/* prettier-ignore-end */
