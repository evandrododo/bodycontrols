import { forwardRef } from "react";
import { Mesh } from "three";

export const PosePoint = forwardRef<Mesh, { color: string }>(
  ({ color }, ref) => {
    return (
      <mesh ref={ref}>
        <sphereBufferGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
    );
  }
);