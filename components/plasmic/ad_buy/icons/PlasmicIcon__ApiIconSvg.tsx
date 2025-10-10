/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ApiIconSvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ApiIconSvgIcon(props: ApiIconSvgIconProps) {
  const { className, style, title, ...restProps } = props;
  return (
    <svg
      xmlns={"http://www.w3.org/2000/svg"}
      fill={"none"}
      viewBox={"0 0 26 11"}
      height={"1em"}
      className={classNames("plasmic-default__svg", className)}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <path
        fill={"currentColor"}
        d={
          "m8.702 10.384-7.44-3.792a1.35 1.35 0 0 1-.552-.528 1.35 1.35 0 0 1-.144-.672 1.17 1.17 0 0 1 .168-.672q.192-.36.576-.552L8.702.4Q9.398.064 9.95.208t.864.84q.312.672.072 1.2-.24.504-.936.84L5.342 5.392 9.95 7.696q.696.336.936.84t-.072 1.2q-.312.672-.864.84-.552.144-1.248-.192m8.604 0q-.672.336-1.224.192-.552-.168-.888-.84-.312-.696-.072-1.2.264-.504.936-.84l4.608-2.304-4.608-2.304q-.672-.336-.936-.84-.24-.528.072-1.2.336-.696.888-.84T17.306.4l7.392 3.768q.408.192.576.552.192.336.168.672.024.312-.168.672-.168.336-.528.528z"
        }
      ></path>
    </svg>
  );
}

export default ApiIconSvgIcon;
/* prettier-ignore-end */
