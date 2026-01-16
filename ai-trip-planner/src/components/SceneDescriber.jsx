import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function SceneDescriber() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [description, setDescription] = useState("No description yet.");
  const [loading, setLoading] = useState(false);

  // 🎥 Step 1 — Start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Unable to access camera. Please allow camera permissions.");
    }
  };

  // 🧠 Step 2 — Capture frame and send to backend (Gemini)
  const describeScene = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Capture the current video frame
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    // Convert image to Base64 string
    const reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = async () => {
      const base64data = reader.result.split(",")[1]; // remove data:image/jpeg;base64,

      try {
        // ✅ Send to your Gemini backend proxy
        const response = await fetch("http://localhost:5000/api/describe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64data }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        const caption =
          result[0]?.generated_text ||
          result.generated_text ||
          "Unable to describe scene.";

        setDescription(caption);
        speak(caption); // 🗣️ Speak it out loud
      } catch (error) {
        console.error("❌ Error describing scene:", error);
        setDescription("Error: Unable to fetch description.");
      } finally {
        setLoading(false);
      }
    };
  };

  // 🔊 Step 3 — Speak the description aloud
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN"; // Indian English accent
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/80 text-white p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🎥 AI Scene Describer</h1>
      <p className="text-lg text-gray-300 mb-6 max-w-md">
        Uses your camera and Google Gemini Vision AI to describe your surroundings.
        <br />
        <span className="italic text-sm text-gray-400">
          (Camera + Gemini Vision AI + Voice Output)
        </span>
      </p>

      {/* Camera Preview */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg shadow-lg mb-4 w-[90%] max-w-md border border-gray-600"
      ></video>

      {/* Hidden Canvas for Capturing Frames */}
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="hidden"
      ></canvas>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={startCamera}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
        >
          📷 Start Camera
        </button>

        <button
          onClick={describeScene}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "🧠 Describe Scene"}
        </button>
      </div>

      {/* Description Box */}
      <div className="bg-gray-800 p-4 rounded-lg w-[90%] max-w-md shadow-md">
        <h2 className="text-xl font-semibold mb-2">Scene Description:</h2>
        <p className="text-gray-200">{description}</p>
      </div>

      {/* Back Button */}
      <Link to="/">
        <button className="mt-8 bg-gray-700 hover:bg-gray-600 px-5 py-3 rounded-lg">
          ⬅ Back to Home
        </button>
      </Link>
    </div>
  );
}

export default SceneDescriber;
