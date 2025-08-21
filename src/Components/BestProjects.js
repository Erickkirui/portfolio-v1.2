import React from 'react';
import '../Styles/project.css';

function BestProjects() {
  return (
    <div className='featured-project'>
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
