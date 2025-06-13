import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widget from "./Widgets.js";
import BestSellingProducts from "./BestSellingProducts.js";
import RecentActivity from "./RecentActivity.js";
import RecentOrders from "./RecentOrders.js";
import Revenue from "./Revenue.js";
import SalesByLocations from "./SalesByLocations.js";
import Section from "./Section.js";
import StoreVisits from "./StoreVisits.js";
import TopSellers from "./TopSellers.js";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Widget />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Revenue />
                  </Col>
                  <SalesByLocations />
                </Row>
                <Row>
                  <BestSellingProducts />
                  <TopSellers />
                </Row>
                <Row>
                  <StoreVisits />
                  <RecentOrders />
                </Row>
              </div>
            </Col>
            <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
