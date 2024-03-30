"use client"
import React, { useRef, useEffect } from 'react';
import Webcam from "react-webcam";

const Video = () => {
  const webcamRef = useRef(null);

    useEffect(() => {
      const interval = setInterval(() => {
          const imageSrc = webcamRef.current.getScreenshot();
          sendImageToBackend(imageSrc);
      }, 10000);

      return () => clearInterval(interval);
  }, []);

  const sendImageToBackend = async (imageSrc) => {
      try {
          const response = await fetch('http://127.0.0.1:5000/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: imageSrc })
          });
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data);
      } catch (error) {
          console.error('Error sending image:', error);
      }
  };


  return (
    <Webcam
        audio={false}
        height={window.innerHeight * 0.4}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={window.innerWidth * 0.4}
        style={{ borderRadius: '15px' }}
    />
  );
}

export default Video;