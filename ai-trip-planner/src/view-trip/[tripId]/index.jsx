import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "@/firebase";
import { toast } from "sonner";

import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import Itinerary from "../components/Itinerary";

const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  // 🔹 Get trip data from Realtime Database
  const GetTripData = async () => {
    try {
      const snapshot = await get(ref(db, `AITrips/${tripId}`));

      if (snapshot.exists()) {
        console.log("Trip Data:", snapshot.val());
        setTrip(snapshot.val());
      } else {
        toast("No trip found");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast("Failed to load trip");
    }
  };

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  if (!trip) {
    return <div className="p-6">Loading trip...</div>;
  }

  return (
    <div className="w-full min-h-screen">
      {/* Information Section */}
      <InfoSection trip={trip} />

      {/* Recommended Hotels */}
      <Hotels trip={trip} />

      {/* Daily Plan */}
      <Itinerary trip={trip} />
    </div>
  );
};

export default ViewTrip;
