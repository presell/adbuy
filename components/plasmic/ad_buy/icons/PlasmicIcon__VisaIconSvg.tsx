/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type VisaIconSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function VisaIconSvgIcon(props: VisaIconSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 750 243"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "m371.25 4.35-50.075 234.175h-60.6L310.725 4.35zm254.925 151.2L658.05 67.6l18.375 87.95zm67.575 82.975h56.05L700.9 4.35h-51.975c-11.475 0-21.325 7.025-25.475 17l-.075.175-90.875 217h63.6l12.65-35h77.725zm-158.125-76.45c.25-61.825-85.475-65.225-84.875-92.85.2-8.4 8.175-17.35 25.675-19.625 3.25-.325 7-.525 10.8-.525 17.775 0 34.625 4.05 49.625 11.3l-.675-.3L546.8 10.4C529.975 3.875 510.5.075 490.15 0h-.025c-59.9 0-102.025 31.875-102.4 77.45-.375 33.7 30.075 52.475 53.05 63.725 23.625 11.475 31.55 18.85 31.425 29.075-.15 15.75-18.8 22.65-36.25 22.925-.8.025-1.775.025-2.725.025-21.775 0-42.275-5.475-60.175-15.15l.675.325-10.975 51.3c19.65 7.875 42.425 12.425 66.275 12.425h1.125-.05c63.65 0 105.275-31.425 105.5-80.1zM284.675 4.35l-98.15 234.175h-64.05L74.175 51.6c-.925-9.1-6.5-16.7-14.25-20.5l-.15-.075c-17.2-8.45-37.2-15.325-58.125-19.65L0 11.1l1.45-6.775h103.1c14.05 0 25.725 10.275 27.9 23.7l.025.15L158 163.7 221.05 4.3z"
        }
      ></path>
    </svg>
  );
}

export default VisaIconSvgIcon;
/* prettier-ignore-end */
