import "./App.css";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { useEffect, useRef } from "react";
import { drawMesh } from "./utilities.jsx";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFacemesh = async () => {
      try {
        const net = facemesh.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: 'mediapipe', // or 'tfjs'
          solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh',
        };
        
        const detector = await facemesh.createDetector(net, detectorConfig);
        setInterval(() => {
          detect(detector);
        }, 100);
      } catch (error) {
        console.error("Error initializing FaceMesh detector:", error);
      }
    };
    runFacemesh();
  }, []);
  
  const detect = async (detector) => {
    try {
      // Ensure webcam is ready
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
  
        // Set video and canvas dimensions
        webcamRef.current.width = videoWidth;
        webcamRef.current.height = videoHeight;
  
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
  
        // Estimate faces
        const faces = await detector.estimateFaces(video);
        console.log(faces);

        const ctx = canvasRef.current.getContext("2d");
        drawMesh(faces, ctx) 

      } else {
        console.warn("Webcam is not ready.");
      }
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };
  return (
    <div className="App">
      <Webcam ref={webcamRef} style={{}} />
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
