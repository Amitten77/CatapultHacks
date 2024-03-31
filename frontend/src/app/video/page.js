"use client"
import React, { useState, useRef, useEffect } from 'react';
import Webcam from "react-webcam";


const addItemToFridge = async (item) => {
  try {
    const response = await fetch('http://localhost:3001/fridge/item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Item added successfully:', data);
  } catch (error) {
    console.error('Error adding item to fridge:', error);
  }
};

const getNewItemInfo = async (word) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/newitem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word: word })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching new item info:', error);
  }
};

const Video = () => {
  const webcamRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("Dylan"); // State to store the backend response
  const [records, setRecords] = useState([]);
  const [webcamVisible, setWebcamVisible] = useState(false);

  const handleToggleWebcam = () => {
    setWebcamVisible(!webcamVisible); // Toggle the visibility
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/fridge');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRecords(data); // Store the records in state
      } catch (error) {
        console.error("Could not fetch the data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (webcamVisible && webcamRef.current) {
        const imageSrcEarlier = webcamRef.current.getScreenshot();
        setTimeout(() => {
          const imageSrcRecent = webcamRef.current.getScreenshot();
     
          sendImageToBackend(imageSrcRecent, imageSrcEarlier);
        }, 500);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [webcamVisible]); 

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
      if (data.message.length === 0 || data.message.food_item.length == 1 && data.message.food_item[0] === '') {
        console.log("Nothing in sight")
      } else {
        data.message.food_item.forEach(element => {
          if (!records.some(record => record.itemName === element)) {
            const additions = getNewItemInfo(element);
            let currentDate = new Date();
            let result = new Date(currentDate);
            result.setDate(result.getDate() + Number(additions.expiration));
            const additionalItem = {
              itemName: element,
              date_added: currentDate,
              status: "IN FRIDGE",
              time_removed: currentDate,
              category: additions.category,
              expiration: result
            }
            addItemToFridge(
              additionalItem
            );
            setRecords(prevRecords => [...prevRecords, addedItem]);
          } else if (records.some(record => record.itemName === element && record.status === "IN_FRIDGE")){

          }
        })
      }
      setResponseMessage(data.message); // Update the state with the response
    } catch (error) {
      console.error('Error sending image:', error);
      setResponseMessage("Error sending image"); // Update the state in case of error
    }
  };

  return (
    <>
    {webcamVisible ? (
      <Webcam
        audio={false}
        height={window.innerHeight * 0.41}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={window.innerWidth * 0.41}
        style={{ borderRadius: '15px' }}
      />
    ) : (<div class="false__fridge" style={{width: window.innerWidth * 0.41, height: window.innerHeight * 0.6, borderRadius: '15px' }}>Yooo</div>)}
    <div className='mt-4 mx-64'>
    <button 
       type="button"
       className="hover__cam__button rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-black"
       onClick={handleToggleWebcam}>
        {webcamVisible ? 'Close Fridge' : 'Open Fridge'}
      </button>
    </div>
    </>
  );
}

export default Video;