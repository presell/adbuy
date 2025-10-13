/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type AnalyticsSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function AnalyticsSvgrepoComSvgIcon(
  props: AnalyticsSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      xmlnsXlink={"http://www.w3.org/1999/xlink"}
      fill={"none"}
      viewBox={"0 -35.5 170 170"}
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
            "M159.524.393c-3.125-.27-5.466.358-7.154 1.909-2.199 2.02-3.262 5.553-3.339 11.106a4824 4824 0 0 1-5.438 6.188 2403 2403 0 0 0-12.675 14.487c-4.188 4.84-8.413 9.798-12.499 14.593l-5.267 6.177c-.475-.01-.97-.045-1.489-.08a12.7 12.7 0 0 0-4.599.233c-2.004.608-3.195.04-4.957-1.375-9.698-7.783-18.712-13.83-27.557-18.486a4.96 4.96 0 0 1-1.788-1.393 5 5 0 0 1-.986-2.048 10.63 10.63 0 0 0-4.803-6.441 10.48 10.48 0 0 0-7.904-1.203 11.15 11.15 0 0 0-6.7 4.649 11.3 11.3 0 0 0-1.785 7.999c.11.739.242 1.478.37 2.182l.102.578-35.517 34.429-.54-.056a22 22 0 0 0-1.819-.145c-5.874-.17-9.485 2.42-11.37 8.154-1.415 4.301.134 8.14 1.422 10.653a11.4 11.4 0 0 0 3.854 4.472 11.3 11.3 0 0 0 5.557 1.928q.3.016.6.017a11.46 11.46 0 0 0 5.46-1.48c1.67-.944 3.08-2.29 4.105-3.92 3.061-4.638 3.537-8.984 1.445-13.271l34.464-33.092 9.601-2.99 28.481 19.696c.225 4.236 1.271 7.412 3.374 10.26a9.4 9.4 0 0 0 5.04 3.63 9.32 9.32 0 0 0 6.185-.327c5.683-2.177 8.839-7 8.69-13.256l34.565-43.274c4.903.965 8.709.515 11.316-1.343 2.016-1.434 3.243-3.658 3.646-6.61a11.1 11.1 0 0 0-.218-4.466 11 11 0 0 0-1.963-4.01 11.2 11.2 0 0 0-3.536-2.864 11.1 11.1 0 0 0-4.374-1.21"
          }
        ></path>
      </g>

      <defs>
        <clipPath id={"a"}>
          <path fill={"#fff"} d={"M.777 0h169v99h-169z"}></path>
        </clipPath>
      </defs>
    </svg>
  );
}

export default AnalyticsSvgrepoComSvgIcon;
/* prettier-ignore-end */
