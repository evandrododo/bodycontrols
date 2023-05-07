import { forwardRef, useEffect, useRef, useState } from "react";
import "./App.css";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";

const useFrameLoop = (callback: any) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(time, deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
};

const PosePoint = forwardRef(
  (
    {
      backgroundColor,
    }: {
      backgroundColor: string;
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
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
  }
);

function App() {
  const refVideo = useRef<HTMLVideoElement>(null);
  const divRefs = useRef<Array<React.MutableRefObject<HTMLDivElement | null>>>(
    []
  );
  for (let i = 0; i < 17; i++) {
    divRefs.current.push(useRef<HTMLDivElement>(null));
  }
  const refDetector = useRef<poseDetection.PoseDetector>();

  const loadDetector = async () => {
    refDetector.current = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet
    );
    console.log(refDetector.current);
  };

  const loadVideo = async () => {
    const video = refVideo.current;
    if (video) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
        },
      });
      video.srcObject = stream;
    }
  };

  useEffect(() => {
    const loadAsync = async () => {
      await loadVideo();
      await loadDetector();
    };
    loadAsync();
  }, []);

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
      const div = divRefs.current[i]?.current;
      div?.style.setProperty(
        "left",
        `${newPoses?.[0].keypoints[i].x}px`
      );
      div?.style.setProperty(
        "top",
        `${newPoses?.[0].keypoints[i].y}px`
      );
    }
  };

  useFrameLoop(() => {
    estimatePoses();
  });
  return (
    <>
      <div>
        <PosePoint backgroundColor={"#FF0000"} ref={divRefs.current[0]} />
        <PosePoint backgroundColor={"#FFA500"} ref={divRefs.current[1]} />
        <PosePoint backgroundColor={"#FFFF00"} ref={divRefs.current[2]} />
        <PosePoint backgroundColor={"#A5FF00"} ref={divRefs.current[3]} />
        <PosePoint backgroundColor={"#00FF00"} ref={divRefs.current[4]} />
        <PosePoint backgroundColor={"#00FFA5"} ref={divRefs.current[5]} />
        <PosePoint backgroundColor={"#00FFFF"} ref={divRefs.current[6]} />
        <PosePoint backgroundColor={"#00A5FF"} ref={divRefs.current[7]} />
        <PosePoint backgroundColor={"#0000FF"} ref={divRefs.current[8]} />
        <PosePoint backgroundColor={"#A500FF"} ref={divRefs.current[9]} />
        <PosePoint backgroundColor={"#FF00FF"} ref={divRefs.current[10]} />
        <PosePoint backgroundColor={"#FF00A5"} ref={divRefs.current[11]} />
        <PosePoint backgroundColor={"#FFA5A5"} ref={divRefs.current[12]} />
        <PosePoint backgroundColor={"#A5A5FF"} ref={divRefs.current[13]} />
        <PosePoint backgroundColor={"#A5FFFF"} ref={divRefs.current[14]} />
        <PosePoint backgroundColor={"#A5FFA5"} ref={divRefs.current[15]} />
        <PosePoint backgroundColor={"#FFFFA5"} ref={divRefs.current[16]} />

        <video
          id="video"
          width="640"
          height="480"
          autoPlay
          muted
          ref={refVideo}
          style={{
            opacity: 0,
          }}
        ></video>
      </div>
    </>
  );
}

export default App;
