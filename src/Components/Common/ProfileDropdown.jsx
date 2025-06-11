import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

import BaseButton from "../BASE/BaseButton";
import userApi from "../../api/userApi";
import { LoginRoutes } from "../../Routes/apiRoutes";
import avatarFallback from "../../assets/images/users/user-dummy-img.jpg";
import { CONSTANTS } from "../constants/common";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userApi.viewProfile();
        setUserProfile(res.data?.data || {});
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate(LoginRoutes.LOGIN, { replace: true });
  };

  const profileImage = userProfile?.profile_image;

  const avatarSrc = profileImage
    ? `${import.meta.env.VITE_BASE_IMAGE}${profileImage}`
    : avatarFallback;

  const email = userProfile?.email || "";
  const role = userProfile?.role || "";

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
              src={avatarSrc}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = avatarFallback;
              }}
              className="rounded-circle header-profile-user"
              alt="user-avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {email}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                {role}
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <h6 className="dropdown-header">Welcome {email}!</h6>
          <DropdownItem className="p-0">
            <Link to={LoginRoutes.PROFILE} className="dropdown-item">
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Profile</span>
            </Link>
          </DropdownItem>
          <DropdownItem onClick={() => setShowLogoutModal(true)}>
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
            <span className="align-middle" data-key="t-logout">
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

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
