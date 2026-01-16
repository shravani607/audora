import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "@/firebase";
import UserTripCardItem from "./components/UserTripCardItem";

const MyTrips = () => {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    try {
      const snapshot = await get(ref(db, "AITrips"));

      if (snapshot.exists()) {
        const data = snapshot.val();

        // 🔹 filter trips by logged-in user
        const tripsArray = Object.values(data).filter(
          (trip) => trip.userEmail === user.email
        );

        setUserTrips(tripsArray);
      } else {
        setUserTrips([]);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    GetUserTrips();
  }, []);

  return (
    <div className="p-10 md:px-20 lg:px-36">
      <h2 className="font-bold text-4xl text-center">My Trips</h2>

      {userTrips.length === 0 && (
        <p className="text-center mt-6">No trips found</p>
      )}

      <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-5">
        {userTrips.map((trip, index) => (
          <UserTripCardItem trip={trip} key={index} />
        ))}
      </div>
    </div>
  );
};

export default MyTrips;
