import React from 'react'
import '../Styles/Technologies.css'

function Technologies() {
  return (
    <div className='tech'>
      <h1>
        What i use
      </h1>
      <p>I am not limited to these technilogies but i  do my best work using them </p>


      <div className='tech-tree'>
        <h3>Backend</h3>
        <ul>
            <li>Python </li>
            <li>Flask </li>
            <li>SQL</li>

        </ul>
        
      </div>

      <div className='tech-tree'>
        <h3>Frontend</h3>
        <ul>
            <li>Javascript</li>
            <li>React </li>
            <li>Next JS</li>
            <li>Wordpress</li>

        </ul>
      </div>
      

      <div className='tech-tree'>
        <h3>Support Tech</h3>
        <ul>
            <li>Figma UI/UX </li>
            <li>Photoshop </li>
            <li>Boostrap </li>
            <li> Tailwind </li>
            <li>Postman</li>
           

        </ul>
      </div>
    </div>
  )
}

export default Technologies
