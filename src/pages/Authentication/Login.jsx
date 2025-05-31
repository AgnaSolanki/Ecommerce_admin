import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Form,
  FormFeedback,
} from "reactstrap";

import { CONSTANTS } from "../../Components/constants/common";
import { toast } from "react-toastify";
import ParticlesAuth from "./ParticlesAuth";
import { jwtDecode } from "jwt-decode";
import BaseInput from "../../Components/BASE/BaseInput";
import BaseButton from "../../Components/BASE/BaseButton";
import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";
import authService from "../../api/apiServices";
import { LoginRoutes } from "../../Routes/Constant";
import { loginValidationSchema } from "../../Components/constants/validation";

const Login = (props) => {
  const navigate = useNavigate();

  document.title = "Login | Velzon - React Admin & Dashboard Template";

  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    initialValues: {
      [CONSTANTS.email]: "",
      [CONSTANTS.password]: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setLoading(true);
      setError("");
      try {
        const response = await authService.login({
          email: values.email,
          password: values.password,
        });

        const accessToken = response?.data?.data?.token;
        const decodedToken = jwtDecode(accessToken);

        toast.success(response?.data?.message);
        sessionStorage.setItem("token", accessToken);
        sessionStorage.setItem("userId", decodedToken.id);
        sessionStorage.setItem("email", decodedToken.email);
        sessionStorage.setItem("role", decodedToken.role);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: decodedToken.id,
            email: decodedToken.email,
            role: decodedToken.role,
          })
        );
        navigate(LoginRoutes.DASHBOARD_ROUTE);
      } catch (err) {
  console.log("Login error:", err.response?.data.message);

  let errorMessage = err?.response?.data?.message;

  if (Array.isArray(errorMessage)) {
    errorMessage = errorMessage.join(", ");
  }

  toast.error(errorMessage);


      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link
                    to={LoginRoutes.HOME}
                    className="d-inline-block auth-logo"
                  >
                    <img src={logoLight} alt="" height="20" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium">
                  Premium Admin & Dashboard Template
                </p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">
                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Welcome Back !</h5>
                  </div>

                  <div className="p-2 mt-4">
                    <Form onSubmit={validation.handleSubmit}>
                      <div className="mb-3">
                        <BaseInput
                          id={CONSTANTS.email}
                          name={CONSTANTS.email}
                          label={CONSTANTS.Email}
                          placeholder={CONSTANTS.EmailPlaceholder}
                          type={CONSTANTS.email}
                          formik={validation}
                        />

                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <div className="float-end">
                          <Link to={LoginRoutes.RESET} className="text-muted">
                            Forgot password?
                          </Link>
                        </div>

                        {validation.touched.password &&
                        validation.errors.password ? (
                          // Show InputGroup WITH eye icon only when there's a validation error
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <BaseInput
                              id={CONSTANTS.password}
                              name={CONSTANTS.password}
                              label={CONSTANTS.Password}
                              placeholder={CONSTANTS.PasswordPlaceholder}
                              formik={validation}
                              showPasswordToggle={true}
                              passwordShown={passwordShow}
                              setPasswordShown={setPasswordShow}
                            />
                          </div>
                        ) : (
                          // Show plain input only if no error
                          <div className="position-relative">
                            <BaseInput
                              id={CONSTANTS.password}
                              name={CONSTANTS.password}
                              label={CONSTANTS.Password}
                              placeholder={CONSTANTS.PasswordPlaceholder}
                              formik={validation}
                              showPasswordToggle={true}
                              passwordShown={passwordShow}
                              setPasswordShown={setPasswordShow}
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <BaseButton
                          type="submit"
                          color="success"
                          block={true}
                          loading={loading}
                          disabled={!!error}
                        >
                          {!loading ? "Sign In" : null}
                        </BaseButton>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(Login);