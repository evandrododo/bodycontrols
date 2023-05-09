import { useEffect, useRef, useState } from "react";
import "./App.css";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { PosePoint } from "./PosePoint";
import { useFrameLoop } from "./useFrameLoop";
import { Canvas } from "@react-three/fiber";

function App() {
  const refVideo = useRef<HTMLVideoElement>(null);
  const divRefs = useRef<Array<React.MutableRefObject<HTMLDivElement | null>>>(
    []
  );
  for (let i = 0; i < 17; i++) {
    divRefs.current.push(useRef<HTMLDivElement>(null));
  }
  const refDetector = useRef<poseDetection.PoseDetector>();
  const [showCamera, setShowCamera] = useState(false);

  const loadDetector = async () => {
    refDetector.current = await poseDetection.createDetector(
      poseDetection.SupportedModels.PoseNet
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
      const pose = newPoses?.[0].keypoints[i];
      const div = divRefs.current[i]?.current;
      const normalizedX = pose.x / 640;
      const normalizedY = pose.y / 480;
      const previousPosX = div?.style.getPropertyValue("left");
      const previousPosY = div?.style.getPropertyValue("top");
      const nextPosX = normalizedX * window.innerWidth;
      const nextPosY = normalizedY * window.innerHeight;
      const fluidity = 0.2;
      const posX =
        previousPosX === ""
          ? nextPosX
          : (1 - fluidity) * Number(previousPosX?.replace("px", "")) +
            fluidity * nextPosX;
      const posY =
        previousPosY === ""
          ? nextPosY
          : (1 - fluidity) * Number(previousPosY?.replace("px", "")) +
            fluidity * nextPosY;

      const previousOpacity = div?.style.getPropertyValue("opacity");
      const opacity =
        previousOpacity === ""
          ? pose.score
          : (1 - fluidity) * Number(previousOpacity) +
            fluidity * (pose.score || 0);

      div?.style.setProperty("opacity", `${opacity}`);
      div?.style.setProperty("left", `${posX}px`);
      div?.style.setProperty("top", `${posY}px`);
    }
  };

  useFrameLoop(() => {
    estimatePoses();
  });

  return (
    <>
      <div>
        <PosePoint backgroundColor={"#00FFFF"} ref={divRefs.current[0]} />
        <PosePoint backgroundColor={"#00A5FF"} ref={divRefs.current[1]} />
        <PosePoint backgroundColor={"#0000FF"} ref={divRefs.current[2]} />
        <PosePoint backgroundColor={"#A500FF"} ref={divRefs.current[3]} />
        <PosePoint backgroundColor={"#FF00FF"} ref={divRefs.current[4]} />
        <PosePoint backgroundColor={"#00FFA5"} ref={divRefs.current[5]} />
        <PosePoint backgroundColor={"#00FF00"} ref={divRefs.current[6]} />
        <PosePoint backgroundColor={"#00A5FF"} ref={divRefs.current[7]} />
        <PosePoint backgroundColor={"#0000FF"} ref={divRefs.current[8]} />
        <PosePoint backgroundColor={"#A500FF"} ref={divRefs.current[9]} />
        <PosePoint backgroundColor={"#FF00FF"} ref={divRefs.current[10]} />
        <PosePoint backgroundColor={"#FF00A5"} ref={divRefs.current[11]} />
        <PosePoint backgroundColor={"#FFA5A5"} ref={divRefs.current[12]} />
        <PosePoint backgroundColor={"#FFA5A5"} ref={divRefs.current[13]} />
        <PosePoint backgroundColor={"#FF00A5"} ref={divRefs.current[14]} />
        <PosePoint backgroundColor={"#FFA500"} ref={divRefs.current[15]} />
        <PosePoint backgroundColor={"#FF0000"} ref={divRefs.current[16]} />

        <video
          id="video"
          width="640"
          height="480"
          autoPlay
          muted
          ref={refVideo}
          style={{
            opacity: showCamera ? 1 : 0,
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 160,
            height: 120,
          }}
        ></video>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            color: "white",
            fontSize: 10,
          }}
        >
          <button
            onClick={() => {
              setShowCamera(!showCamera);
            }}
          >
            show camera
          </button>
        </div>
      </div>
      <Canvas>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.05, 32, 32]} />
          <meshStandardMaterial color={"#FF0000"} />
        </mesh>
        <ambientLight />
      </Canvas>
    </>
  );
}

export default App;
