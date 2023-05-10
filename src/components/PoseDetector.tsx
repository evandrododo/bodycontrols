import { useEffect, useRef } from "react";
import { PosePoint } from "./PosePoint";
import { Mesh } from "three";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { useFrame } from "@react-three/fiber";

export const PoseDetector = ({
  refVideo,
}: {
  refVideo: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
  const refDetector = useRef<poseDetection.PoseDetector>();
  const pointRefs = useRef<Array<React.MutableRefObject<Mesh | null>>>([]);
  for (let i = 0; i < 17; i++) {
    pointRefs.current.push(useRef<Mesh>(null));
  }

  useEffect(() => {
    const loadAsync = async () => {
      await loadDetector();
    };
    loadAsync();
  }, []);

  const loadDetector = async () => {
    refDetector.current = await poseDetection.createDetector(
      poseDetection.SupportedModels.PoseNet
    );
    console.log(refDetector.current);
  };

  const estimatePoses = async () => {
    if (
      !refDetector.current ||
      !refVideo.current ||
      refVideo.current.paused ||
      refVideo.current.ended
    ) {
      return;
    }
    const newPoses = await refDetector.current?.estimatePoses(refVideo.current);
    for (let i = 0; i < 17; i++) {
      const pose = newPoses?.[0].keypoints[i];
      const normalizedX = pose.x / 640;
      const normalizedY = -pose.y / 480;
      const point = pointRefs.current[i]?.current;
      if (point) {
        point.position.x = normalizedX * 2;
        point.position.y = normalizedY * 2;
      }
    }
  };

  useFrame(() => {
    estimatePoses();
  });

  return (
    <>
      <PosePoint color={"#FF0000"} ref={pointRefs.current[0]} />
      <PosePoint color={"#FFAA00"} ref={pointRefs.current[1]} />
      <PosePoint color={"#FFFF00"} ref={pointRefs.current[2]} />
      <PosePoint color={"#AAFF00"} ref={pointRefs.current[3]} />
      <PosePoint color={"#00FF00"} ref={pointRefs.current[4]} />
      <PosePoint color={"#00FFAA"} ref={pointRefs.current[5]} />
      <PosePoint color={"#00FFFF"} ref={pointRefs.current[6]} />
      <PosePoint color={"#00AAFF"} ref={pointRefs.current[7]} />
      <PosePoint color={"#0000FF"} ref={pointRefs.current[8]} />
      <PosePoint color={"#AA00FF"} ref={pointRefs.current[9]} />
      <PosePoint color={"#FF00FF"} ref={pointRefs.current[10]} />
      <PosePoint color={"#FF00AA"} ref={pointRefs.current[11]} />
      <PosePoint color={"#FFFFFF"} ref={pointRefs.current[12]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[13]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[14]} />
    </>
  );
};
