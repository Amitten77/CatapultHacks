"use client"

import Video from '../video/page.js'
import { Tourney } from "next/font/google";
import React, { useState, useEffect } from 'react';

const tourney = Tourney({ subsets: ["latin"] });

const Home = () => {
  let transition = false;

  return (
    <div>
      <div className="main">
        <div className="list" id="list">
          <h1 className="text-2xl">Frozen AI</h1>
          <p>This is a bunch of dummy text.</p>
          <a href="#add">Add</a>
        </div>
        <div className="transition" onClick={handleTransition}>
          <a href={transition ? "#list" : "#add"} className="transition__button">{transition ? "<" : ">"}</a>
        </div>
        <div className="add" id="add">
          <h1 className="add__text">Add Items to Your List!</h1>
          <div className="add__video">
          <Video></Video>
          </div>
        </div>
      </div>
    </div>
  )

  
  function handleTransition() {
    transition = !transition;
  }
}



export default Home