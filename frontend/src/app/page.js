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
        <div className="header">
            <div className="header__content">
                <div className={tourney.className}>
                <h1 className="header__title">Frozen AI</h1>
                </div>
                <h2 className="header__subtitle">AI technology to your kitchen's refrigerator</h2>
                <div className="header__links">
                  <a className="header__link" href="login">Login</a>
                </div>
            </div>
            <div className="about__switch">
              <a className="about__switch__link" href="#">⇒</a>
            </div>
        </div>
    </div>
  );
};


export default HomePage;