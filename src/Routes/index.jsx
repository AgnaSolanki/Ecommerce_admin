import React from "react";
import { Routes, Route } from "react-router-dom";
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import AuthProtected from "./AuthProtected"; 

const renderRouteElement = (element) => {
  if (typeof element === "function") {
    return React.createElement(element);
  }
  return element;
};

const Index = () => {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={
            <NonAuthLayout>{renderRouteElement(route.element)}</NonAuthLayout>
          }
        />
      ))}

      {/* Protected Routes wrapped with AuthProtected */}
      <Route element={<AuthProtected />}>
        {authProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <VerticalLayout>{renderRouteElement(route.element)}</VerticalLayout>
            }
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Index;
