// pages/Authentication/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate("/login", { replace: true });

   
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      navigate("/login", { replace: true });
    };
  }, [navigate]);

  return null;
};

export default Logout;
