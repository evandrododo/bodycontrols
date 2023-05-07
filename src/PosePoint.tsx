import { forwardRef } from "react";

export const PosePoint = forwardRef<
  HTMLDivElement,
  { backgroundColor: string }
>(({ backgroundColor }, ref) => {
  return (
    <div
      style={{
        position: "absolute",
        width: 10,
        height: 10,
        backgroundColor: backgroundColor,
        borderRadius: 5,
      }}
      ref={ref}
    ></div>
  );
});
