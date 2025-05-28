import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices/index.js";
import { Provider } from "react-redux";

const store = configureStore({ reducer: rootReducer, devTools: true });

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.Fragment>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
);
