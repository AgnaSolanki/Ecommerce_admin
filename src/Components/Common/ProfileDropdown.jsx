import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

import avatar1 from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {
  const [userName, setUserName] = useState("Admin");
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("authUser");
    if (storedUser) {
      const obj = JSON.parse(storedUser);
      const authType = import.meta.env.VITE_DEFAULTAUTH;
      const name =
        authType === "fake"
          ? obj?.username || obj?.data?.first_name || "Admin"
          : authType === "firebase"
          ? obj?.email || "Admin"
          : "Admin";
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    navigate("/logout", { replace: true });
  
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={() => setIsProfileDropdown(!isProfileDropdown)}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {userName}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Founder
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userName}!</h6>

          <DropdownItem onClick={handleLogout}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
