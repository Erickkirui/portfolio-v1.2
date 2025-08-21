import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import '../Styles/sliderprojects.css';

function ProjectsSlider() {
  return (
    <div className="slider-wrapper">

     
      {/* First Swiper with 4 cards (Right-to-Left) */}
      {/* <Swiper
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="swiper-container"
      >
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/VIRGIWAYS.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ALSEYEEE-BIO.jpg" alt="ALSEYEEE Bio" className="slider-image" />
            <div className="text-overlay">
              <h1>ALSEYEEE Bio</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/dcngo.jpg" alt="DC NGO" className="slider-image" />
            <div className="text-overlay">
              <h1>DC NGO</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ngoconnect.jpg" alt="NGO Connect" className="slider-image" />
            <div className="text-overlay">
              <h1>NGO Connect</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper> */}

      <div className='intro-footer'>
            <h1>Creating Art With Code</h1>
        </div>

      {/* Second Swiper with 4 cards (Left-to-Right - Reverse) */}
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        loop={true}
        modules={[Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          reverseDirection: true, // Reverse sliding direction
        }}
        className="swiper-container"
      >
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/PAWAIT.jpg" alt="PAWAIT" className="slider-image" />
            <div className="text-overlay">
              <h1>PAWAIT</h1>
              <a 
                href="https://pawait.africa/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button>View website</button>
              </a>
            </div>
          </div>
        </SwiperSlide>

          <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ALSEYEEE-BIO.jpg" alt="ALSEYEEE Bio" className="slider-image" />
            <div className="text-overlay">
              <h1>ALSEYEEE Bio</h1>
              <a 
                href="https://aleseyeebio.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button>View website</button>
              </a>
            </div>
          </div>
        </SwiperSlide>
        
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ROYALTY.jpg" alt="Royalty" className="slider-image" />
            <div className="text-overlay">
              <h1>Royalty</h1>
              
              <a 
                href="https://royaltyhomeskenya.com/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button>View website</button>
              </a>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/VIRGIWAYS.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
               <a 
                href="https://virgiways.co.ke/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button>View website</button>
              </a>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/YOUTHALIVE.jpg" alt="Youth Alive" className="slider-image" />
            <div className="text-overlay">
              <h1>Youth Alive</h1>
             <a 
                href="https://youthalivekenya.org/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <button>View website</button>
              </a>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default ProjectsSlider;
