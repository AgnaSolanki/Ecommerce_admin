import React from "react";

// Import SCSS
import "./assets/scss/themes.scss";

// Import Routes
import Route from "./Routes";

// Toastify
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <React.Fragment>
      <Route />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        transition={Slide}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        
      />
    </React.Fragment>
  );
}

export default App;
