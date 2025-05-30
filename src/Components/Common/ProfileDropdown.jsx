import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { LOGIN_ROUTE } from "../../api/apiRoutes";

import avatar1 from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserEmail(parsedUser.email || "");
        setUserRole(parsedUser.role || "");
      } catch (err) {
        console.error("Error parsing user data from sessionStorage:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // or sessionStorage.removeItem("user");
    setShowLogoutModal(false);
    navigate(LOGIN_ROUTE, { replace: true });
  };

  return (
    <>
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
                {userEmail}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {userRole}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {userEmail}!</h6>
          <DropdownItem onClick={() => setShowLogoutModal(true)}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Logout Confirmation */}
      <Modal
        isOpen={showLogoutModal}
        toggle={() => setShowLogoutModal(false)}
        centered
        contentClassName="custom-logout-modal"
      >
        <ModalHeader toggle={() => setShowLogoutModal(false)}>
          Confirm Logout
        </ModalHeader>
        <ModalBody>Are you sure you want to log out?</ModalBody>
        <ModalFooter>
          <Button
            style={{ backgroundColor: "#405189", color: "white" }}
            onClick={() => setShowLogoutModal(false)}
          >
            No
          </Button>
          <Button
            style={{ backgroundColor: "#17a2b8", color: "white" }}
            onClick={handleLogout}
          >
            Yes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProfileDropdown;
