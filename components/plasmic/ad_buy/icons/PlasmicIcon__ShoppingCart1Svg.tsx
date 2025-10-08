/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/* prettier-ignore-start */
import React from "react";
import { classNames } from "@plasmicapp/react-web";

export type ShoppingCart1SvgIconProps = React.ComponentProps<"svg"> & {
  title?: string;
};

export function ShoppingCart1SvgIcon(props: ShoppingCart1SvgIconProps) {
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
        "lucide lucide-shopping-cart-icon lucide-shopping-cart"
      )}
      viewBox={"0 0 24 24"}
      height={"1em"}
      style={style}
      {...restProps}
    >
      {title && <title>{title}</title>}

      <circle cx={"8"} cy={"21"} r={"1"}></circle>

      <circle cx={"19"} cy={"21"} r={"1"}></circle>

      <path
        d={
          "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        }
      ></path>
    </svg>
  );
}

export default ShoppingCart1SvgIcon;
/* prettier-ignore-end */
