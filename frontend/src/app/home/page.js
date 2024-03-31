"use client"
import Video from '../video/page.js'
import { Tourney } from "next/font/google";
import React, { useRef, useState, useEffect } from 'react';

const tourney = Tourney({ subsets: ["latin"] });


const Home = () => {

  const elementRef = useRef(null);
  let rect = 0;

  const [isTransitioned, setIsTransitioned] = useState(false);
  const [filter, setFilter] = useState("Post Date");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/fridge');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setRecords(data); // Store the records in state
      } catch (error) {
        console.error("Could not fetch the data", error);
      }
    };
    fetchData();
  }, [])

  // let websiteLoop = setInterval(() => {
  //   rect = elementRef.current.getBoundingClientRect();
  //   if (rect.x < window.innerWidth * 0.5) {
  //     setIsTransitioned(true);
  //   } else {
  //     setIsTransitioned(false);
  //   }
  // }, 200);

  const handleFilterChange = (event) => {
    // arr.filter((el) => el.toLowerCase().includes(query.toLowerCase()));
    setFilter(event.target.value);
    switch (event.target.value) {
      case "Expiration":
        // If you're just trying to force a re-render, consider using a more explicit method
        // However, if you're not changing the order or contents, you might not need to do anything here
        setRecords([...records].sort((a, b) => new Date(a.expiration) - new Date(b.expiration)));
        break;
      case "Category":
        setRecords([...records].sort((a, b) => b.category.length - a.category.length));
        break;
      default:
        // Handle any other case or do nothing
        break;
    }
  };

  return (
    <div>
      <div className="main">
        <div className="list" id="list">
          <div className="title__content">
            <div className="title__content__header">
              <img className="w-32 mr-5" src="logo.png"></img>
              <h1 className={tourney.className}>Frozen AI</h1>
            </div>
            <p>View your stored items in your refrigerator!</p>
            <div className="mt-8 sm:col-span-2">
                  <select
                    id="filter"
                    name="filter"
                    className="block rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={filter}
                    value={filter} // Controlled component
                    onChange={handleFilterChange} // Attach the event handler
                  >
                    <option>Select Filter</option>
                    <option>Expiration</option>
                    <option>Category</option>
                  </select>
                </div>
          </div>
          <div className="list__content">
            {records.map((post,i) => {
              if (i % 2 == 1) return;
              return (
                <div className="row">
                  <div className="item">
                  <div className="item__image__container">
                    <img className="item__image" src={records[i].category + ".png"}></img> 
                  </div>
                    <div className="item__content">
                      <h2 className="item__title">{records[i].itemName}</h2>
                      <p className={formatAppDeadline(records[i].expiration) == "Expired" ? "red item__expiration" : "item__expiration"}>{formatAppDeadline(records[i].expiration)}</p>
                    </div>
                  </div>
                  <div className={i + 1 != records.length ? "item" : "hide"}>
                  <div className="item__image__container">
                    <img className="item__image" src={i + 1 != records.length ? records[i + 1].category + ".png" : ""}></img>
                  </div>
                    <div className="item__content"> 
                      <h2 className="item__title">{i + 1 != records.length ? records[i + 1].itemName : ""}</h2>
                      <p className={i + 1 != records.length ? (formatAppDeadline(records[i + 1].expiration) == "Expired" ? "red item__expiration" : "item__expiration") : ""}>{i + 1 != records.length ? formatAppDeadline(records[i + 1].expiration) : ""}</p>
                    </div>
                  </div>
                </div>   
              )
            })}
          </div>
          <div className="signout">
            <a className="signout__button" href="http://localhost:3000/">Log Out</a>
          </div>
        </div>
        {/* <a href={isTransitioned ? "#list" : "#add"} className="transition" ref={elementRef}>
          <p className="transition__button">{!isTransitioned ? "<" : ">"}</p>
        </a> */}
        {isTransitioned ?
        <a href="#list" className="transition" onClick={() => setIsTransitioned(!isTransitioned)}>
          <p className="transition__button">{"<"}</p>
        </a> :
        <a href="#add" className="transition" onClick={() => setIsTransitioned(!isTransitioned)}>
          <p className="transition__button">{">"}</p>
        </a>
        }

        
        <div className="add" id="add">
          <div className="title__content text-white">
            <div className="title__content__header">
              <h1 className={tourney.className}>Fridge View</h1>
              <img className="w-32" src="logo.png"></img>
            </div>
          </div>
          <div className="add__video">
          <Video></Video>
          </div>
        </div>
      </div>
    </div>
  )

  function formatAppDeadline(ISOdate, appDeadline) {
    const postdate = new Date(ISOdate)
    const now = new Date();
    const msDifference = postdate - now

    const daysElapsed = Math.floor(msDifference / (1000 * 60 * 60 * 24))

    if (daysElapsed > 0)
    return `Expires in ${parseInt(daysElapsed + 1)} day${parseInt(daysElapsed + 1) == 1 ? "" : "s"}`;

    return "Expired"
}
}



export default Home