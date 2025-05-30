import React from "react";
import { Routes, Route } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";

const renderRouteElement = (element) => {
  if (typeof element === "function") {
    return React.createElement(element);
  }
  // Already JSX
  return element;
};

const Index = () => {
  return (
    <Routes>
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<NonAuthLayout>{renderRouteElement(route.element)}</NonAuthLayout>}
        />
      ))}

      {authProtectedRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<VerticalLayout>{renderRouteElement(route.element)}</VerticalLayout>}
        />
      ))}
    </Routes>
  );
};

export default Index;
