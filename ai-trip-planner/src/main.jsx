import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateTrip from "./create-trip/index.jsx";
import ViewTrip from "./view-trip/[tripId]/index.jsx";
import MyTrips from "./my-trips/index.jsx";
import SceneDescriber from "./components/SceneDescriber.jsx";
import Header from "./components/custom/Header.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ParallaxProvider } from "react-scroll-parallax";

// ✅ Define all routes
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/create-trip", element: <CreateTrip /> },
  { path: "/view-trip/:tripId", element: <ViewTrip /> },
  { path: "/my-trip", element: <MyTrips /> },
  { path: "/scene-describer", element: <SceneDescriber /> },
  {
    path: "*",
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center p-8">
        <h1 className="text-5xl font-extrabold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6 max-w-md">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          🏠 Go Back Home
        </a>
      </div>
    ),
  },
]);

// ✅ Render
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="1001301162970-pms2l3g9cif39klequ06ah6bepldrd3s.apps.googleusercontent.com">
      <ParallaxProvider>
        <Header />
        <Toaster />
        <RouterProvider router={router} />
      </ParallaxProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
