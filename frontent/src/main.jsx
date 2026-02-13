

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { SoftProvider } from "../context/SoftContext";
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SoftProvider>
      <App />
    </SoftProvider>
  </BrowserRouter>
);
