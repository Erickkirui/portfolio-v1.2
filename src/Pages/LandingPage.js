import React from 'react'
import HeroSection from '../Components/HeroSection'
import ProjectsSlider from '../Components/ProjectsSlider'
import Technologies from '../Components/Technologies'
import BestProjects from '../Components/BestProjects'

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <Technologies />
      <ProjectsSlider />
      <BestProjects />
    </div>
  )
}

export default LandingPage
