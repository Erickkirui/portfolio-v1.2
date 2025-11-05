import React from 'react';
import '../Styles/project.css';

function BestProjects() {
  return (
    <div className='featured-project'>
      <h1>Featured Project</h1>
      <h2>Care Connect</h2>
      <p>Care is a digital platform that connects users with trusted specialists and service providers.
      Users can conveniently book appointments, and providers can efficiently reach, manage, and grow their patient base.</p>
      <h3>Technologies</h3>
      <ul>
        <li>Flask</li>
        <li>Next JS</li>
      </ul>
      <img src='/images/care-connect.gif' alt="screenshot of projects" />

      <h1>Featured Project</h1>
      <h2>Ngo Connect</h2>
      <p>
        NGOconnect is a user-friendly platform that connects users with a comprehensive list of NGOs in Kenya, enabling you
        to explore missions, volunteer opportunities, and fundraising campaigns.
      </p>
      <h3>Technologies</h3>
      <ul>
        <li>Flask</li>
        <li>React</li>
      </ul>
      <img src='/images/ngoconnect.jpg' alt="screenshot of projects" />


      <h2>Diraja System</h2>
      <p>
        Diraja is a full management system that intergrates with the full day to day operations
        of a business  from inventory management ,sales records ,Expenses to employee managemnt.
      </p>
      <h3>Technologies</h3>
      <ul>
        <li>Flask</li>
        <li>React</li>
      </ul>
     <img src="/images/diraja.gif" alt="screenshot of projects" />


    </div>
  );
}

export default BestProjects;
