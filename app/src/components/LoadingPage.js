import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Import ProgressBar component from React Bootstrap

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 1000); // Adjust the interval according to your loading time

    // Load your ML model here
    // Replace the setTimeout with your actual loading logic
    setTimeout(() => {
      clearInterval(interval);
      // Once the model is loaded, redirect to the actual page
      window.location.href = '/actual-page'; // Redirect to actual page
    }, 5000); // Simulating 5 seconds loading time, replace with your actual loading time

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h1 className="text-center mb-4">Loading Page</h1>
          <ProgressBar now={progress} label={`${progress}%`} />
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;