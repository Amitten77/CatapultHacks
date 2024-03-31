"use client"
import React, { useState, useEffect } from 'react';
import { Tourney } from "next/font/google";

const tourney = Tourney({ subsets: ["latin"] });

const HomePage = () => {
//   const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
   
  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <div className="hero">
        <div className="header" id="1">
            <div className="header__content header__content__margin">
                <div className={tourney.className}>
                <h1 className="header__title">Fridg.AI</h1>
                </div>
                <h2 className="header__subtitle">Bringing AI technology to your refrigerator</h2>
                <div className="header__links">
                  <a className="header__link" href="login">Login</a>
                </div>
            </div>
            <div className="about__switch">
              <a className="about__switch__link" href="#2">⇒</a>
            </div>
        </div>

        <div className="header" id="2">
            <div className="header__content">
                <h2 className="header__text">Introducing Fridg.AI, a software that tracks food items entering and leaving your fridge, automatically notifying you when items are about to expire via an user-friendly web application. With advanced sensors and machine learning algorithms, it streamlines inventory management, reduces food waste, and enhances your kitchen experience.</h2>
                <div className="header__links">
                  <a className="header__link" href="#1">Back</a>
                </div>
            </div>
        </div>
    </div>
  );
};


export default HomePage;