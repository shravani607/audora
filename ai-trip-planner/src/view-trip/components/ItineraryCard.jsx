import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const ItineraryCard = ({ day, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl mb-4 bg-white shadow">
      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center p-4 cursor-pointer"
      >
        <div>
          <h3 className="font-semibold text-lg">
            {day.day || `Day ${index + 1}`}
          </h3>
          {day.bestTime && (
            <p className="text-sm text-gray-500">
              Best Time: {day.bestTime}
            </p>
          )}
        </div>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* BODY */}
      {open && (
        <div className="p-4 border-t space-y-6">
          {Array.isArray(day.plan) &&
            day.plan.map((place, i) => (
              <div key={i} className="border-b pb-4 last:border-b-0">
                <h4 className="font-semibold text-blue-900 text-lg">
                  {place.placeName}
                </h4>

                <p className="text-gray-600 mt-1">
                  {place.placeDetails}
                </p>

                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>⭐ Rating: {place.rating}</p>
                  <p>⏱ Time Needed: {place.timeTravel}</p>
                  <p>🎟 Ticket: {place.ticketPricing}</p>
                </div>

                {place.placeImageURL && (
                  <img
                    src={place.placeImageURL}
                    alt={place.placeName}
                    className="mt-3 rounded-lg w-full h-48 object-cover"
                  />
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryCard;
