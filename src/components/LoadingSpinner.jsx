import React from "react";
import "./Loader.css";

const LoadingSpinner = () => {
  return (
    <div className="loader-wrapper">
      <div className="film">
        <div className="hole"></div>
        <div className="hole"></div>
        <div className="hole"></div>
      </div>
      <p className="loading-text">Loading…</p>
    </div>
  );
};

export default LoadingSpinner;
