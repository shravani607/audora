import React from "react";
import Hero from "./components/custom/Hero";

function App() {
  return (
    <div className="bg-[url('/bg.jpg')] bg-cover min-h-screen text-white">
      <Hero />
    </div>
  );
}

export default App;
