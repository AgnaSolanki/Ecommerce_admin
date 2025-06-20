import React, { useEffect, useState } from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Collapse,
} from "reactstrap";
import withRouter from "./withRouter";

//redux
import { changeSidebarTheme } from "../../slices/thunks";

import { useSelector, useDispatch } from "react-redux";

//SimpleBar
import SimpleBar from "simplebar-react";
import classnames from "classnames";

import { createSelector } from "reselect";

const RightSidebar = (props) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  function tog_show() {
    setShow(!show);
    dispatch(changeSidebarTheme("gradient"));
  }

  useEffect(() => {
    if (
      show &&
      document.getElementById("sidebar-color-dark") &&
      document.getElementById("sidebar-color-light")
    ) {
      document.getElementById("sidebar-color-dark").checked = false;
      document.getElementById("sidebar-color-light").checked = false;
    }
  });

  const selectLayoutState = (state) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutType: layout.layoutType,
      leftSidebarType: layout.leftSidebarType,
      layoutModeType: layout.layoutModeType,
      layoutWidthType: layout.layoutWidthType,
      layoutPositionType: layout.layoutPositionType,
      topbarThemeType: layout.topbarThemeType,
      leftsidbarSizeType: layout.leftsidbarSizeType,
      leftSidebarViewType: layout.leftSidebarViewType,
      leftSidebarImageType: layout.leftSidebarImageType,
      preloader: layout.preloader,
      sidebarVisibilitytype: layout.sidebarVisibilitytype,
    })
  );
  // Inside your component
  const { preloader } = useSelector(selectLayoutProperties);

  // open offcanvas
  const [open, setOpen] = useState(true);
  const toggleLeftCanvas = () => {
    setOpen(!open);
  };

  window.onscroll = function () {
    scrollFunction();
  };

  const scrollFunction = () => {
    const element = document.getElementById("back-to-top");
    if (element) {
      if (
        document.body.scrollTop > 100 ||
        document.documentElement.scrollTop > 100
      ) {
        element.style.display = "block";
      } else {
        element.style.display = "none";
      }
    }
  };

  const toTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const pathName = props.router.location.pathname;

  useEffect(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      document.getElementById("preloader").style.opacity = "1";
      document.getElementById("preloader").style.visibility = "visible";
      setTimeout(function () {
        document.getElementById("preloader").style.opacity = "0";
        document.getElementById("preloader").style.visibility = "hidden";
      }, 1000);
    }
  }, [preloader, pathName]);

  return (
    <React.Fragment>
      <button
        onClick={() => toTop()}
        className="btn btn-danger btn-icon back-to-top-arrow"
        id="back-to-top"
      >
        <i className="ri-arrow-up-line"></i>
      </button>

      {preloader === "enable" && (
        <div id="preloader">
          <div id="status">
            <div
              className="spinner-border text-primary avatar-sm"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default withRouter(RightSidebar);
