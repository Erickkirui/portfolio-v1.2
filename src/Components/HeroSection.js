import React from 'react'

function HeroSection() {
  return (
    <div className='hero-container'>
        <div>
            <h1> Koeh Erick Kirui</h1>
        </div>
        <div className='location'>
            <img src='/images/map.png' alt="map-location" />
            <h3>Nairobi,Kenya</h3>
        </div>
        <div>
            <p>
            A dedicated and seasoned <span>software engineer</span> in my fourth year in the field with a passion 
            for transforming abstract concepts into functional and innovative solutions.</p>
        </div>
      
    </div>
  )
}

export default HeroSection
