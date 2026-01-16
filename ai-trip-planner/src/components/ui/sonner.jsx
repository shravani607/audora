import React from "react";
import { Toaster as Sonner } from "sonner";

export const Toaster = ({
  position = "top-right",
  richColors = true,
  expand = false,
  ...props
}) => {
  return (
    <Sonner
      position={position}
      richColors={richColors}
      expand={expand}
      {...props}
    />
  );
};

export default Toaster;
