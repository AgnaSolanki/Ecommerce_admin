import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";

const DashboardEcommerce = () => {
  document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                {/* <Section rightClickBtn={toggleRightColumn} /> */}
                <Row></Row>
                <Row>
                  <Col xl={8}></Col>
                </Row>
                <Row></Row>
                <Row></Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
