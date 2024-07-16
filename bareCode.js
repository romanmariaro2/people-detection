import * as cocossd from "@tensorflow-models/coco-ssd";
import { useRef } from "react";

// Function to make decisions based on detections
async function makeDecisions(initialScreenOn, video) {
  // Define values
  const someoneIsDetected = useRef(false);
  const screenOn = useRef(initialScreenOn);
  const noDetectionsCount = useRef(0);
  const detectionsCount = useRef(0);

  // Load network
  const net = await cocossd.load();

  // Define the decision-making process
  const updateDetections = async () => {
    // Make the detections
    const obj = await net.detect(video);

    // Process predictions
    const filteredBoxes = processDetections(obj);

    // Update people detection values
    if (filteredBoxes.length === 0) {
      someoneIsDetected.current = false;
      noDetectionsCount.current += 1;
      detectionsCount.current = 0;
    } else {
      someoneIsDetected.current = true;
      detectionsCount.current += 1;
      noDetectionsCount.current = 0;
    }

    // Update screenOn value
    if (someoneIsDetected.current) {
      if (detectionsCount.current > 4) {
        screenOn.current = true;
      }
    } else {
      if (noDetectionsCount.current > 10) {
        screenOn.current = false;
      }
    }

    console.log('Someone is detected:', someoneIsDetected.current);
    console.log('The screen is on:', screenOn.current);
  };

  // Run the decision-making process at intervals
  setInterval(updateDetections, 1000);

  return screenOn.current;
}

// Function to process predictions
function processDetections(detections) {
  let filteredBoxes = [];
  detections.forEach((prediction) => {
    // Get prediction results
    const [x, y, width, height] = prediction["bbox"];
    if (prediction["class"] === "person") {
      filteredBoxes.push([x, y, width, height]);
    }
  });

  return filteredBoxes;
}
