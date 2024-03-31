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

const updateFridgeItem = async (itemName, statusChange) => {
  const currentTime = new Date().toISOString(); // Convert the current time to ISO string format

  try {
    const response = await fetch('http://localhost:3001/fridge/item', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemName: itemName,
        updateFields: {
          status: statusChange,
          time_removed: currentTime,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating item in fridge:', error);
    return null; // Return null or appropriate error handling
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
    return data;
  } catch (error) {
    console.error('Error fetching new item info:', error);
  }
};

const Video = () => {
  const webcamRef = useRef(null);
  const [responseMessage, setResponseMessage] = useState("Dylan"); // State to store the backend response
  const [records, setRecords] = useState([]);
  const [webcamVisible, setWebcamVisible] = useState(false);

  const updateFridgeItemNew = async (itemName) => {
    const currentTime = new Date();
    const oldDateAdded = new Date(item.date_added);
    const oldExpiration = new Date(item.expiration);
    const expirationDifference = oldExpiration - oldDateAdded;
    const newExpiration = new Date(currentTime.getTime() + expirationDifference).toISOString();
    const item = records.find(record => record.itemName === itemName);
  
    try {
      const response = await fetch('http://localhost:3001/fridge/item', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: itemName,
          updateFields: {
            status: "IN FRIDGE",
            time_removed: currentTime.toISOString(),
            date_added: currentTime.toISOString(),
            expiration: newExpiration,
          },
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Item updated successfully:', data);
      return data; 
    } catch (error) {
      console.error('Error updating item in fridge:', error);
      return null;
    }
  };

  const handleToggleWebcam = () => {
    setWebcamVisible(!webcamVisible);
  };
  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/fridge');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Could not fetch the data", error);
    }
  };

  useEffect(() => {
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
      console.log(data, "RAHUL BANSAL")
      if (data.message.length === 0 || data.message.food_item.length == 1 && data.message.food_item[0] === '') {
        console.log("Nothing in sight")
      } else {
        const itemNames = records.map(record => record.itemName);
        let elementName;
        for (const element of data.message.food_item) {
          const response = await fetch('http://127.0.0.1:8000/canAdd', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: element, entries: itemNames})
          });
          const data = await response.json();
          if (data.invalid) {
            continue;
          } else {
            elementName = data.name;
          }
          if (!records.some(record => record.itemName === elementName)) {
            await getNewItemInfo(elementName).then(additions => {
              let currentDate = new Date();
              let result = new Date(additions.message.expiration);
              const additionalItem = {
                itemName: elementName,
                date_added: currentDate,
                status: "IN FRIDGE",
                time_removed: currentDate,
                category: additions.message.category,
                expiration: result
              }
              addItemToFridge(
                additionalItem
              );
              setRecords(prevRecords => [...prevRecords, additionalItem]);
            });
          } else if (records.some(record => record.itemName === elementName && record.status === "IN FRIDGE" && new Date() - new Date(record.date_added) >=  30 * 1000)){ //item is in fridge and its been in there for at least 30 minutes
            console.log("ZACH EDEY")
            await updateFridgeItem(elementName, "REMOVED").then(() => {
              fetchData();
            });
          } else if (records.some(record => record.itemName === elementName && 
            record.status === "REMOVED"
            &&
            new Date() - new Date(record.time_removed) <= 2 * 60 * 60 * 1000 
            && new Date() - new Date(record.time_removed) >= 2 * 60 * 1000)) { //time removed is within 2 hours and greater than 1 minute
              await updateFridgeItem(elementName, "IN FRIDGE").then(() => {
                fetchData();
              });
            } else if (records.some(record => record.itemName === elementName && 
              record.status === "REMOVED"
              &&
              new Date() - new Date(record.timeRemoved) > 2 * 60 * 60 * 1000)) {
                await updateFridgeItemNew(elementName).then(() => {
                  fetchData();
                })
              }
          }
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