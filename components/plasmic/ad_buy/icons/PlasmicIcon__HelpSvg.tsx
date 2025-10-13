/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type HelpSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function HelpSvgIcon(props: HelpSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 0 800 800"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <g clipPath={"url(#a)"}>
        <path
          fill={"#000"}
          d={
            "M400 0C179.1 0 0 179.075 0 400s179.075 400 400 400 400.025-179.075 400.025-400S620.95 0 400 0m0 750.8C207 750.8 50 593 50 400S207 50 400 50s350.025 157 350.025 350S593 750.8 400 750.8m-36.75-125.425h62.9V561.9h-62.9zm36-450.75c-36.625 0-66.8 9.875-90.5 29.6s-35.225 59.25-34.65 92l.925 1.825H332.4c0-19.525 6.525-47.6 19.525-57.7s28.8-15.1 47.325-15.1q32.025 0 49.275 17.4c11.5 11.6 17.225 28.175 17.225 49.725 0 18.125-4.25 33.575-12.8 46.375-8.575 12.8-22.9 31.125-43.025 54.95-20.775 18.725-33.6 33.775-38.45 45.15s-7.425 31.85-7.625 61.35h60.125c0-18.5 1.175-32.125 3.5-40.9s9-18.6 19.975-29.6c23.625-22.775 42.575-45.05 56.925-66.85 14.325-21.75 21.5-45.775 21.5-72.025 0-36.625-11.075-65.175-33.275-85.6s-53.35-30.65-93.4-30.65z"
          }
        ></path>
      </g>

      <defs>
        <clipPath id={"a"}>
          <path fill={"#fff"} d={"M0 0h800v800H0z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default HelpSvgIcon;
/* prettier-ignore-end */
