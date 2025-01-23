import React from 'react'
import '../Styles/project.css'

function BestProjects() {
  return (
    <div className='featured-project'>
      <h1>Featured Project</h1>
      <h2>Ngo Connect</h2>
      <p>NGOconnect is a user - friendly platform that connects users with a comprehensive list of NGOs in Kenya, enabling you 
        to explore missions, volunteer opportunities, and fundraising campaigns
        </p>
        <h3>Technoligies</h3>
        <ul>
            <li>
                Flask
            </li>
            <li>
                React
            </li>
        </ul>
        <img  src='/images/ngoconnect.jpg' alt='image for project'/>


    </div>
  )
}

export default BestProjects
