import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginRoutes } from "../Routes/apiRoutes";
import { FiBox } from "react-icons/fi";
import { FiGrid } from "react-icons/fi";


const Navdata = () => {
  const history = useNavigate();
  const [isProduct, setIsProduct] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
  
    if (iscurrentState !== "isProduct") {
      setIsProduct(false);
    }
  }, [history,isCategory, isProduct]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "product",
      label: "Product",
      icon: FiBox,
      link: LoginRoutes.PRODUCT_LIST,
      stateVariables: isProduct,
      click: function (e) {
        e.preventDefault();
        setIsProduct(!isProduct);
        setIscurrentState("Product");
        updateIconSidebar(e);
      },
    },
    {
      id: "category",
      label: "Category",
      icon: FiGrid,
      link: LoginRoutes.CATEGORY_LIST,
      stateVariables: isCategory,
      click: function (e) {
        e.preventDefault();
        setIsCategory(!isCategory);
        setIscurrentState("Category");
        updateIconSidebar(e);
      },
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
