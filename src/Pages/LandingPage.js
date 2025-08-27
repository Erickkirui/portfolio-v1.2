import React, { useEffect } from "react";
import HeroSection from "../Components/HeroSection";
import ProjectsSlider from "../Components/ProjectsSlider";
import Technologies from "../Components/Technologies";
import BestProjects from "../Components/BestProjects";

function LandingPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.streamlyne.io/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="home-page-container">
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

      {/* Embedded Form */}
      <section>
        <iframe
          src="https://link.streamlyne.io/widget/form/FYvFwfItX2PIb4Bg5gWs"
          style={{ width: "100%", height: "600px", border: "none", borderRadius: "3px" }}
          id="inline-FYvFwfItX2PIb4Bg5gWs"
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name="Erick Portfiolio"
          data-height="undefined"
          data-layout-iframe-id="inline-FYvFwfItX2PIb4Bg5gWs"
          data-form-id="FYvFwfItX2PIb4Bg5gWs"
          title="Erick Portfiolio"
        />
      </section>
    </div>
  );
}

export default LandingPage;
