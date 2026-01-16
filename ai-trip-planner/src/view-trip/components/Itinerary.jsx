import React from "react";
import ItineraryCard from "./ItineraryCard";

const Itinerary = ({ trip }) => {
  const tripData = trip?.tripData;

  // ✅ Get raw itinerary safely
  let raw =
    tripData?.itinerary ||
    tripData?.plan ||
    tripData?.dailyPlan ||
    [];

  // 🔐 Normalize data to array
  if (!Array.isArray(raw)) {
    raw = [raw];
  }

  // ❌ No itinerary
  if (raw.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Itinerary</h2>
        <p className="text-gray-500 mt-2">
          No itinerary data available.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6">Daily Itinerary</h2>

      {raw.map((place, index) => (
        <ItineraryCard
          key={index}
          day={place}
          index={index}
        />
      ))}
    </div>
  );
};

export default Itinerary;
