import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
// import { PoseDetector } from "./components/PoseDetector";
import { HandDetector } from "./components/HandDetector";

function App() {
  const refVideo = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);

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
    };
    loadAsync();
  }, []);

  return (
    <>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5] }}>
        {/* <PoseDetector refVideo={refVideo} /> */}
        <HandDetector refVideo={refVideo}/>
        <ambientLight />
      </Canvas>
      <div>
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
    </>
  );
}

export default App;
