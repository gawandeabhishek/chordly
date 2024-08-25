import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/service-worker.js';
    navigator.serviceWorker.register(swUrl).then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
