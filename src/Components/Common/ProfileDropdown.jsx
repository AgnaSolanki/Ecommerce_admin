import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseButton from "../BASE/BaseButton";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { LoginRoutes } from "../../Routes/Routes";

import avatar1 from "../../assets/images/users/user-dummy-img.jpg";
import { CONSTANTS } from "../constants/common";

const ProfileDropdown = () => {
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem(CONSTANTS.user);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserEmail(parsedUser.email || "");
        setUserRole(parsedUser.role || "");
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate(LoginRoutes.LOGIN, { replace: true });

  };

  return (
    <>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={() => setIsProfileDropdown(!isProfileDropdown)}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type={CONSTANTS.Button} className="btn">
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

      {/* Logout Confirmation Modal */}
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
        <ModalFooter className="model-footer">
          <BaseButton
            className="model-no"
            onClick={() => setShowLogoutModal(false)}
          >
            No
          </BaseButton>
          <BaseButton className="model-yes" onClick={handleLogout}>
            Yes
          </BaseButton>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ProfileDropdown;
