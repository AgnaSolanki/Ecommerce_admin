import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Collapse } from "reactstrap";
import navdata from "../LayoutMenuData";
import withRouter from "../../Components/Common/withRouter";


const VerticalLayout = (props) => {
  const [openMenus, setOpenMenus] = useState({});

  const navData = navdata();
  const path = props.router.location.pathname;
  const toggleMenu = (menuLabel) => {
  setOpenMenus((prevState) => ({
    ...prevState,
    [menuLabel]: !prevState[menuLabel],
  }));
};


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const initMenu = () => {
      const pathName = import.meta.env.PUBLIC_URL + path;
      const ul = document.getElementById("navbar-nav");
      if (!ul) return;
      const items = ul.getElementsByTagName("a");
      let itemsArray = [...items];
      removeActivation(itemsArray);
      let matchingMenuItem = itemsArray.find((x) => x.pathname === pathName);
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };

    if (props.layoutType === "vertical") {
      initMenu();
    }
  }, [path, props.layoutType]);

  function activateParentDropdown(item) {
    item.classList.add("active");
    let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

    if (parentCollapseDiv) {
      parentCollapseDiv.classList.add("show");
      parentCollapseDiv.parentElement.children[0].classList.add("active");
      parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
    }
  }

  const removeActivation = (items) => {
    let actiItems = items.filter((x) => x.classList.contains("active"));

    actiItems.forEach((item) => {
      item.classList.remove("active");
      if (item.nextElementSibling) {
        item.nextElementSibling.classList.remove("show");
      }
      item.setAttribute("aria-expanded", false);
    });
  };

  return (
    <React.Fragment>
      {(navData || []).map((item, key) => (
        <React.Fragment key={key}>
          {item.isHeader ? (
            <li className="menu-title"></li>
          ) : item.subItems ? (
            <li className="nav-item">
            <Link
  onClick={(e) => {
    e.preventDefault(); 
    toggleMenu(item.label);
  }}
  className="nav-link menu-link"
  to={item.link ? item.link : "/#"}
>
                <item.icon size={20} />
                <span>{item.label}</span>
                <i className={`menu-arrow ${openMenus[item.label] ? 'rotate' : ''}`}></i>
              </Link>

                          <Collapse
  className="menu-dropdown"
  isOpen={!!openMenus[item.label]}
><ul className="nav nav-sm flex-column">
                  {item.subItems.map((subItem, key) => (
                    <React.Fragment key={key}>
                      {!subItem.isChildItem ? (
                        <li className="nav-item">
                          <Link
                            to={subItem.link ? subItem.link : "/#"}
                            className="nav-link"
                          >
                            {subItem.label}
                            {subItem.badgeName ? (
                              <span
                                className={"badge badge-pill bg-" + subItem.badgeColor}
                                data-key="t-new"
                              >
                                {subItem.badgeName}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ) : (
                        <li className="nav-item">
                          <Link
                            to={subItem.link ? subItem.link : "/#"}
                            className="nav-link"
                          >
                            {subItem.label}
                            {subItem.badgeName ? (
                              <span
                                className={"badge badge-pill bg-" + subItem.badgeColor}
                                data-key="t-new"
                              >
                                {subItem.badgeName}
                              </span>
                            ) : null}
                          </Link>

                          <Collapse
                            className="menu-dropdown"
                            isOpen={subItem.stateVariables}
                            id="sidebarEcommerce"
                          >
                            <ul className="nav nav-sm flex-column">
                              {subItem.childItems &&
                                subItem.childItems.map((childItem, key) => (
                                  <li className="nav-item" key={key}>
                                    <Link
                                      to={childItem.link ? childItem.link : "/#"}
                                      className="nav-link"
                                    >
                                      {childItem.label}
                                    </Link>
                                  </li>
                                ))}
                            </ul>
                          </Collapse>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </Collapse>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="nav-link menu-link" to={item.link ? item.link : "/#"}>
                <item.icon size={20} />
                <span>{item.label}</span>
                {item.badgeName ? (
                  <span
                    className={"badge badge-pill bg-" + item.badgeColor}
                    data-key="t-new"
                  >
                    {item.badgeName}
                  </span>
                ) : null}
                
              </Link>
            </li>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

VerticalLayout.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(VerticalLayout);
