import React from 'react';
import './App.css';
import WebCam from "./components/WebCam/WebCam";
import WebCamVideo from "./components/WebCamVideo/WebCamVideo";

function App() {
  return (
    <div className="App">
      <WebCamVideo />
    </div>
  );
}

export default App;
