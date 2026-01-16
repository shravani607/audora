import React from "react";
import HotelCardItem from "./HotelCardItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Hotels = ({ trip }) => {
  // ✅ SAFE fallback
  const hotels = Array.isArray(trip?.tripData?.hotel)
    ? trip.tripData.hotel
    : [];

  const settings = {
    infinite: hotels.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: hotels.length > 1,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  // 🟡 No hotels case
  if (hotels.length === 0) {
    return (
      <div className="mt-12 mx-auto md:mx-16 lg:mx-32 p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">
          Hotel Recommendations
        </h2>
        <p className="text-gray-500">
          No hotel data available for this trip.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 mx-auto md:mx-16 lg:mx-32 p-6 rounded-lg shadow-lg">
      <div className="text-4xl font-bold text-center mb-8">
        Hotel Recommendations
      </div>

      <div className="slider-container">
        <Slider {...settings}>
          {hotels.map((h, i) => (
            <div key={i} className="p-2">
              <HotelCardItem h={h} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hotels;
