// pages/Authentication/Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LOGIN_ROUTE } from "../../api/apiRoutes";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    navigate(LOGIN_ROUTE, { replace: true });

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      navigate(LOGIN_ROUTE, { replace: true });
    };
  }, [navigate]);

  return null;
};

export default Logout;
