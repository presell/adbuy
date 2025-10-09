/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ApiProductSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ApiProductSvgIcon(props: ApiProductSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 35 35"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <rect
        width={"34.5"}
        height={"34.5"}
        x={".25"}
        y={".25"}
        fill={"#A3A3A3"}
        stroke={"#171717"}
        strokeWidth={".5"}
        rx={"8.75"}
      ></rect>

      <path
        fill={"#171717"}
        d={
          "m13.702 23.384-7.44-3.792a1.35 1.35 0 0 1-.552-.528 1.35 1.35 0 0 1-.144-.672 1.17 1.17 0 0 1 .168-.672q.192-.36.576-.552l7.392-3.768q.696-.336 1.248-.192t.864.84q.312.672.072 1.2-.24.504-.936.84l-4.608 2.304 4.608 2.304q.696.336.936.84t-.072 1.2q-.312.672-.864.84-.552.144-1.248-.192m8.604 0q-.672.336-1.224.192-.552-.168-.888-.84-.312-.696-.072-1.2.264-.504.936-.84l4.608-2.304-4.608-2.304q-.672-.336-.936-.84-.24-.528.072-1.2.336-.696.888-.84t1.224.192l7.392 3.768q.408.192.576.552.192.336.168.672.024.312-.168.672-.168.336-.528.528z"
        }
      ></path>
    </svg>
  );
}

export default ApiProductSvgIcon;
/* prettier-ignore-end */
