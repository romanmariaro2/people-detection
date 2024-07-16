// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import { processPredictions} from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const someoneIsDetected = useRef(false);
  const screenOn = useRef(false)
  const noDetectionsCount = useRef(0)
  const detectionsCount = useRef(0)

  // Main function
  const runCoco = async () => {
    // Load network
    const net = await cocossd.load();

    // Loop and detect
    setInterval(() => {
      detectPeople(net);
    }, 1000);

  };

  const detectPeople = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Get context and apply transformations
      const ctx = canvasRef.current.getContext("2d");
      ctx.save();
      ctx.scale(-1, 1); // Flip horizontally
      ctx.translate(-videoWidth, 0); // Adjust translation to flip back

      // Make Detections
      const obj = await net.detect(video);
      //console.log(obj);

      // Process predictions
      const filteredBoxes = processPredictions(ctx, obj)

      if(filteredBoxes.length === 0) {
        someoneIsDetected.current = false
        noDetectionsCount.current += 1
        detectionsCount.current = 0
      } else {
        someoneIsDetected.current = true
        detectionsCount.current += 1
        noDetectionsCount.current = 0
      }

      console.log('Someone is detected: ', someoneIsDetected.current)

      if(someoneIsDetected.current){
        if(detectionsCount.current > 4){
          screenOn.current = true
        }
      } else {
        if(noDetectionsCount.current > 10){
          screenOn.current = false
        }
      }

      console.log('The screen is on: ', screenOn.current)

      ctx.restore(); // Restore original context
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            transform: "scaleX(-1)",
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;