import React from 'react'
import '../Styles/About.css'
import Storyline from '../Components/Storyline'

function AboutMe() {
  return (
    <div>
      <div className='about-container'>
        <h1>About Me</h1>
        <p>I am Erick Kirui, a dedicated and seasoned software engineer in my fourth
            year in the field with a passion for transforming abstract concepts into functional and innovative solutions. I have a strong foundation in programming languages, including Python (Flask) as a preference for backend and React as a preferred language for 
            the frontend but not limited to the two. As a software engineer, I am not just a coder but a problem solver and a technology enthusiast.</p>

      </div>
      <Storyline />
        <div className='svg-container'>
            <svg width="651" height="2573" viewBox="0 0 651 2573" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M220 2C478.546 395.752 521.942 431.441 188 624.5C-145.941 817.559 612.5 1218.5 541.5 960C470.5 701.5 -19.4998 1752 4.50019 1491C28.5002 1230 353.366 1554.92 561.5 1957C769.634 2359.08 571.62 2545.16 230 2569" stroke="#EB5939" stroke-width="7"/>
            </svg>
        </div>


    </div>
    
  )
}

export default AboutMe
