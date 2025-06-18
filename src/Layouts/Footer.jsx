import React from "react";
import { Col, Container, Row } from "reactstrap";
import { LoginRoutes } from "../Routes/apiRoutes";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === LoginRoutes.LOGIN ||
    location.pathname === LoginRoutes.RESET;
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid>
          {isAuthPage ? (
            <Row>
              <Col className="text-center">
                <p className="mb-0 text-muted">
                  © {new Date().getFullYear()} Shivinfotech.
                </p>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col sm={6}>
                <p className="mb-0 text-muted">
                  © {new Date().getFullYear()} Shivinfotech.
                </p>
              </Col>
              <Col sm={6}>
                <div className="text-sm-end d-none d-sm-block">
                  <p className="mb-0 text-muted">
                    Design & Develop by Shiv Infotech.
                  </p>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </footer>
    </React.Fragment>
  );
};

export default Footer;
