"use client"

import Video from '../video/page.js'
import { Tourney } from "next/font/google";
import React, { useRef, useState, useEffect } from 'react';

const tourney = Tourney({ subsets: ["latin"] });

const records = [
  {
    _id: 1,
    image: 'logo.png',
    title: 'Fresh Apple',
    expiration: '2024-04-10'
  },
  {
    _id: 2,
    image: 'logo.png',
    title: 'Chicken Sandwich',
    expiration: '2024-04-05'
  },
  {
    _id: 3,
    image: 'logo.png',
    title: 'Strawberry Box',
    expiration: '2024-04-08'
  },
  {
    _id: 4,
    image: 'logo.png',
    title: 'Chicken Sandwich',
    expiration: '2024-04-05'
  },
  {
    _id: 5,
    image: 'logo.png',
    title: 'Strawberry Box',
    expiration: '2024-04-08'
  }
];


const Home = () => {

  const elementRef = useRef(null);
  let rect = 0;

  const [isTransitioned, setIsTransitioned] = useState(false);

  let websiteLoop = setInterval(() => {
    rect = elementRef.current.getBoundingClientRect();
    if (rect.x < window.innerWidth * 0.5) {
      setIsTransitioned(true);
    } else {
      setIsTransitioned(false);
    }
  }, 200);

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
          </div>
          <div className="list__content">
            {records.map((post,i) => {
              if (i % 2 == 1) return;
              return (
                <div className="row">
                  <div className="item">
                    <img className="item__image" src={records[i].image}></img> 
                    <div className="item__content">
                      <h2 className="item__title">{records[i].title}</h2>
                      <p className="item__expiration">Expiration in {records[i].expiration} day(s)</p>
                    </div>
                  </div>
                  <div className={i + 1 != records.length ? "item" : "hide"}>
                    <img className="item__image" src={i + 1 != records.length ? records[i + 1].image : ""}></img>
                    <div className="item__content"> 
                      <h2 className="item__title">{i + 1 != records.length ? records[i + 1].title : ""}</h2>
                      <p className="item__expiration">Expiration in {i + 1 != records.length ? records[i + 1].expiration : ""} day(s)</p>
                    </div>
                  </div>
                </div>   
              )
            })}
          </div>
        </div>
        <a href={isTransitioned ? "#list" : "#add"} className="transition" ref={elementRef}>
          <p className="transition__button">{!isTransitioned ? "<" : ">"}</p>
        </a>
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
}



export default Home