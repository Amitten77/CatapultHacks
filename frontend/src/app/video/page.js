"use client"
import React, { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";

const Video = () => {
  const webcamRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("Dylan"); // State to store the backend response

  useEffect(() => {
    const interval = setInterval(() => {
      const imageSrcEarlier = webcamRef.current.getScreenshot();
      setTimeout(() => {
        const imageSrcRecent = webcamRef.current.getScreenshot();
   
        sendImageToBackend(imageSrcRecent, imageSrcEarlier);
      }, 500);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

    const sendImageToBackend = async (imageSrcRecent, imageSrcEarlier) => {

    const base64ImageR = imageSrcRecent.split(',')[1];
    const base64ImageE = imageSrcEarlier.split(',')[1];

    try {
      const response = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageRecent: base64ImageR, imageEarlier: base64ImageE})
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setResponseMessage(data.message); // Update the state with the response
    } catch (error) {
      console.error('Error sending image:', error);
      setResponseMessage("Error sending image"); // Update the state in case of error
    }
  };

  return (
    <>
      <Webcam
        audio={false}
        height={window.innerHeight * 0.4}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={window.innerWidth * 0.4}
        style={{ borderRadius: '15px' }}
      />
      <div>{JSON.stringify(responseMessage, null, 2)}</div>
    </>
  );
}

export default Video;