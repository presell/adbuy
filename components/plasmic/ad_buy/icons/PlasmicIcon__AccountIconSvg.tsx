/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AccountIconSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function AccountIconSvgIcon(props: AccountIconSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 450 460"}
      height={"1em"}
      width={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M231.289 166.31a64.003 64.003 0 00-64.142 36.319 64 64 0 10121.542 21.081 64.13 64.13 0 00-57.4-57.4zm154.1 63.69a154.353 154.353 0 01-1.53 20.79l45.21 35.46a10.81 10.81 0 012.45 13.75l-42.77 74a10.815 10.815 0 01-13.14 4.59l-44.9-18.08a16.115 16.115 0 00-15.17 1.75 164.52 164.52 0 01-21.54 12.54 15.938 15.938 0 00-8.82 12.14l-6.73 47.89a11.082 11.082 0 01-10.68 9.17h-85.54a11.11 11.11 0 01-10.69-8.87l-6.72-47.82a16.077 16.077 0 00-9-12.22 155.287 155.287 0 01-21.46-12.57 16.002 16.002 0 00-15.11-1.71l-44.89 18.07a10.808 10.808 0 01-13.14-4.58l-42.77-74a10.799 10.799 0 012.45-13.75l38.21-30a16.051 16.051 0 006-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 00-6.07-13.94l-38.19-30a10.81 10.81 0 01-2.37-13.68l42.77-74a10.81 10.81 0 0113.14-4.59l44.9 18.08a16.112 16.112 0 0015.17-1.75 164.434 164.434 0 0121.54-12.54 15.942 15.942 0 008.82-12.14l6.73-47.89a11.079 11.079 0 0110.68-9.17h85.54a11.11 11.11 0 0110.69 8.87l6.72 47.82a16.066 16.066 0 009 12.22 155.364 155.364 0 0121.46 12.57 16.002 16.002 0 0015.11 1.71l44.89-18.07a10.81 10.81 0 0113.14 4.58l42.77 74a10.802 10.802 0 01-2.45 13.75l-38.21 30a16.042 16.042 0 00-6.05 14.08c.33 4.14.55 8.3.55 12.47z"
        }
        stroke={"currentColor"}
        strokeWidth={"32"}
        strokeLinecap={"round"}
        strokeLinejoin={"round"}
      ></path>
    </svg>
  );
}

export default AccountIconSvgIcon;
/* prettier-ignore-end */
