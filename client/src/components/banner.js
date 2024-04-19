import React from 'react';
import bannerImg from './TestBannerImage.jpg';

export default function Banner({handleClick}) {
    return (
      <div className="banner">
        <h2 className="banner-text">Experience a new era of foreign language learning</h2>
        <h2 className="banner-description">LanguageMaster is the #1 app for teachers to assist students with pronunciation</h2>
        <img src={bannerImg} alt="Example banner image" className='banner-image'/>
        <div className="banner-gradient-overlay"></div>
        <button className="btn" onClick={handleClick}>Get Started</button>
      </div>
    );
}