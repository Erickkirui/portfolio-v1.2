import React from 'react'
import HeroSection from '../Components/HeroSection'
import ProjectsSlider from '../Components/ProjectsSlider'
import Technologies from '../Components/Technologies'
import BestProjects from '../Components/BestProjects'

function LandingPage() {
  return (
    <div className='home-page-container'>
      {/* Hero Section */}
      <section id="about-section">
        <HeroSection />
      </section>

      {/* Technologies */}
      <Technologies />

      {/* Projects Section */}
      <section id="projects-section">
        <ProjectsSlider />
        <BestProjects />
      </section>

    </div>
  )
}

export default LandingPage
