/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type QuestionSvgrepoComSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function QuestionSvgrepoComSvgIcon(
  props: QuestionSvgrepoComSvgIconProps
) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"currentColor"}
      version={"1.1"}
      viewBox={"0 0 32 32"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        d={
          "M16 0C7.164 0 0 7.163 0 16s7.163 16 16 16 16.001-7.163 16.001-16S24.838 0 16 0m0 30.032C8.28 30.032 2 23.72 2 16S8.28 2 16 2s14.001 6.28 14.001 14S23.72 30.032 16 30.032m-1.47-5.017h2.516v-2.539H14.53zm1.44-18.03q-2.198 0-3.62 1.184c-1.422 1.184-1.409 2.37-1.386 3.68l.037.073h2.295c0-.781.261-1.904.781-2.308s1.152-.604 1.893-.604q1.281 0 1.971.696c.69.696.689 1.127.689 1.989q0 1.087-.512 1.855-.514.768-1.721 2.198-1.247 1.123-1.538 1.806c-.291.683-.297 1.274-.305 2.454h2.405q0-1.11.14-1.636c.14-.526.36-.744.799-1.184q1.417-1.366 2.277-2.674a5.13 5.13 0 0 0 .86-2.881q0-2.198-1.331-3.424c-1.331-1.226-2.134-1.226-3.736-1.226z"
        }
      ></path>
    </svg>
  );
}

export default QuestionSvgrepoComSvgIcon;
/* prettier-ignore-end */
