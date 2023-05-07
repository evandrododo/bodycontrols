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
        top: Math.random() * window.innerHeight,
        left: Math.random() * window.innerWidth,
        opacity: 0.1,
        backgroundColor: backgroundColor,
        borderRadius: 5,
      }}
      ref={ref}
    ></div>
  );
});
