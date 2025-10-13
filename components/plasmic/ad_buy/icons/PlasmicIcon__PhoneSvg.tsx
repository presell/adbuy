/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type PhoneSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function PhoneSvgIcon(props: PhoneSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 694 694"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        fillRule={"evenodd"}
        d={
          "M522.484 691.08c-67.337-16.87-205.187-64.434-330.158-189.404C67.356 376.706 19.794 238.856 2.923 171.52c-9.695-38.697 7.764-76.039 37.367-97.185l77.61-55.433c45.409-32.435 108.579-21.429 140.343 24.452l48.859 70.575c20.74 29.958 13.586 71.019-16.064 92.197l-38.958 27.828c5.896 22.553 24.235 68.87 81.668 126.303 57.434 57.434 103.75 75.77 126.304 81.667l27.826-38.96c21.18-29.646 62.24-36.803 92.197-16.063l70.577 48.86c45.88 31.766 56.886 94.933 24.45 140.343l-55.434 77.61c-21.146 29.603-58.486 47.063-97.183 37.367M239.466 454.536C353.114 568.183 478.527 611.34 538.684 626.413c8.793 2.2 19.423-1.217 26.733-11.45l55.437-77.61c10.81-15.133 7.143-36.19-8.153-46.78l-70.574-48.86-29.863 41.81c-12.203 17.087-34.773 30.487-61.053 24.817-32.8-7.077-93.434-29.774-164.604-100.944S192.74 275.593 185.663 242.793c-5.67-26.28 7.731-48.85 24.817-61.054l41.809-29.863-48.86-70.575c-10.588-15.294-31.645-18.963-46.781-8.151L79.04 128.585c-10.235 7.31-13.652 17.94-11.449 26.733 15.073 60.158 58.229 185.572 171.875 299.218"
        }
        clipRule={"evenodd"}
      ></path>
    </svg>
  );
}

export default PhoneSvgIcon;
/* prettier-ignore-end */
