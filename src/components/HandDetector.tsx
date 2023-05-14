import { useEffect, useRef } from "react";
import { PosePoint } from "./PosePoint";
import { Mesh } from "three";
import "@tensorflow/tfjs-backend-webgl";
import { useFrame } from "@react-three/fiber";
import * as handDetection from '@tensorflow-models/hand-pose-detection';

export const HandDetector = ({
  refVideo,
}: {
  refVideo: React.MutableRefObject<HTMLVideoElement | null>;
}) => {
  const refDetector = useRef<handDetection.HandDetector | null>(null);
  const pointRefs = useRef<Array<React.MutableRefObject<Mesh | null>>>([]);
  for (let i = 0; i < 21; i++) {
    pointRefs.current.push(useRef<Mesh>(null));
  }

  useEffect(() => {
    const loadAsync = async () => {
      await loadDetector();
    };
    loadAsync();
  }, []);

  const loadDetector = async () => {
    const model = handDetection.SupportedModels.MediaPipeHands;
    refDetector.current = await handDetection.createDetector(model, {
      runtime: "mediapipe", // or 'tfjs',
      solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      modelType: "full",
    });

    console.log(refDetector.current);
  };

 const estimateHands = async () => {
    if (
      !refDetector.current ||
      !refVideo.current ||
      refVideo.current.paused ||
      refVideo.current.ended
    ) {
      return;
    }
    const hands = await refDetector.current?.estimateHands(refVideo.current);
    console.log(hands);
    if(!hands || hands.length === 0) return;
    for (let i = 0; i < 21; i++) {
      const pose = hands?.[0].keypoints[i];
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
    // estimatePoses();const 
    estimateHands();
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
      <PosePoint color={"#000000"} ref={pointRefs.current[15]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[16]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[17]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[18]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[19]} />
      <PosePoint color={"#000000"} ref={pointRefs.current[20]} />
    </>
  );
};
