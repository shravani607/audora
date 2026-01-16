import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";

import { toast } from "sonner";
import { chatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGoogleLogin } from "@react-oauth/google";
import { ref, set } from "firebase/database";
import { db } from "@/firebase";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const [searchText, setSearchText] = useState("");
  const [place, setPlace] = useState(null);
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* 🔍 Search destination using OpenStreetMap */
  const handleSearch = async () => {
    if (!searchText.trim()) {
      toast("Enter a destination");
      return;
    }

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}`
      );

      if (!res.data.length) {
        toast("No results found");
        return;
      }

      const loc = res.data[0];
      const latlng = {
        lat: parseFloat(loc.lat),
        lng: parseFloat(loc.lon),
      };

      setPlace({ label: loc.display_name, latlng });
      handleInputChange("location", { label: loc.display_name });
    } catch {
      toast("Failed to search location");
    }
  };

  /* 🔐 Google Login */
  const login = useGoogleLogin({
    onSuccess: (token) => getUserProfile(token),
    onError: () => toast("Login failed"),
  });

  const getUserProfile = async (token) => {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
      }
    );

    localStorage.setItem("user", JSON.stringify(res.data));
    setOpenDialog(false);
    onGenerateTrip();
  };

  /* 🤖 Generate Trip */
  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      !formData.location ||
      !formData.noOfDays ||
      !formData.budget ||
      !formData.noOfPeople
    ) {
      toast("Please fill all details");
      return;
    }

    if (formData.noOfDays > 7) {
      toast("Days should be less than 8");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData.location.label
    )
      .replace("{totalDays}", formData.noOfDays)
      .replace("{traveler}", formData.noOfPeople)
      .replace("{budget}", formData.budget);

    const result = await chatSession.sendMessage(FINAL_PROMPT);
    await saveTrip(result?.response?.text());
    setLoading(false);
  };

  /* 💾 Save trip to Realtime DB */
  const saveTrip = async (tripText) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const tripId = Date.now().toString();

  let parsedTripData;

  try {
    parsedTripData = JSON.parse(tripText);
  } catch (error) {
    console.error("AI JSON parse failed", error);
    parsedTripData = { rawText: tripText };
  }

  await set(ref(db, `AITrips/${tripId}`), {
    userChoice: formData,
    tripData: parsedTripData, // ✅ OBJECT now
    userEmail: user.email,
    id: tripId,
    createdAt: Date.now(),
  });

  navigate(`/view-trip/${tripId}`);
};


  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-blue-100 to-gray-100 py-8 px-4">

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-blue-900 mb-6">
        Travel Preferences ✈️
      </h1>

      {/* DESTINATION */}
      <div className="w-full max-w-2xl mb-8">
        <label className="text-xl font-semibold text-black">
          Destination
        </label>
        <div className="flex gap-2 mt-2">
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search city or place"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {place && (
          <div className="h-80 mt-4 rounded overflow-hidden">
            <MapContainer
              center={place.latlng}
              zoom={8}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={place.latlng}>
                <Popup>{place.label}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      {/* DAYS */}
      <div className="w-full max-w-2xl mb-8">
        <label className="text-xl font-semibold text-black">
          Number of Days
        </label>
        <Input
          type="number"
          placeholder="e.g. 5"
          className="mt-2"
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
      </div>

      {/* BUDGET */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">Budget</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SelectBudgetOptions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleInputChange("budget", item.title)}
              className={`cursor-pointer p-5 rounded-xl border text-center ${
                formData.budget === item.title
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="font-bold mt-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TRAVELLERS */}
      <div className="w-full max-w-2xl mb-8">
        <h2 className="text-xl font-semibold text-black mb-4">
          Travelling With
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SelectTravelList.map((item, i) => (
            <div
              key={i}
              onClick={() =>
                handleInputChange("noOfPeople", item.people)
              }
              className={`cursor-pointer p-5 rounded-xl border text-center ${
                formData.noOfPeople === item.people
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="font-bold mt-2">{item.title}</h3>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <Button
        onClick={onGenerateTrip}
        disabled={loading}
        className="w-full max-w-2xl py-3 text-lg"
      >
        {loading ? "Generating Trip..." : "Generate Trip"}
      </Button>

      {/* LOGIN DIALOG */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              <Button onClick={login} className="w-full mt-4">
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTrip;
