import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import '../Styles/sliderprojects.css';

function ProjectsSlider() {
  return (
    <div className="slider-wrapper">
      {/* First Swiper with 4 cards */}
      <Swiper
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
            <img src="/images/ALSEYEEE-BIO.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/dcngo.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ngoconnect.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Second Swiper with 4 cards */}
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        
        loop={true}
        modules={[Autoplay]}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        className="swiper-container"
      >
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/PAWAIT.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/REALESTATE.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/ROYALTY.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider-item">
            <img src="/images/YOUTHALIVE.jpg" alt="Virgiways Consultants" className="slider-image" />
            <div className="text-overlay">
              <h1>Virgiways Consultants</h1>
              <button>View website</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default ProjectsSlider;
