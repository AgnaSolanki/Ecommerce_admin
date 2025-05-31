import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  FormFeedback,
  Input,
  Label,
  Form,
} from "reactstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";

import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../Authentication/ParticlesAuth";
import authService from "../../api/apiServices"; // Make sure this has sendOtpToEmail and resetPassword

const ForgetPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [forgetError, setForgetError] = useState("");
  const [forgetSuccessMsg, setForgetSuccessMsg] = useState("");

  const validation = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Invalid email")
        .required("Please enter your email"),
      ...(submitted && {
        otp: Yup.string().required("OTP is required"),
        newPassword: Yup.string().required("Password is required").min(6),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword")], "Passwords must match")
          .required("Confirm Password is required"),
      }),
    }),
    onSubmit: async (values) => {
      setForgetError("");
      setForgetSuccessMsg("");

      if (!submitted) {
        try {
          await authService.sendOtpToEmail(values.email);
          toast.success("OTP sent successfully!");
          setSubmitted(true);
        } catch (error) {
          console.error("ERROR:", error);
          toast.error(
            error?.response?.data?.message ||
              error?.message ||
              "Something went wrong. Please try again."
          );
        }
      } else {
        try {
          await authService.changePassword({
            email: values.email,
            otp: values.otp,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          });
          toast.success("Password reset successfully!");
          // Optional: redirect to login
        } catch (error) {
          console.error("Reset Error:", error);
          toast.error(
            error?.response?.data?.message || "Failed to reset password"
          );
        }
      }
    },
  });

  document.title = "Reset Password | Velzon - React Admin & Dashboard Template";

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
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
                    <h5 className="text-primary">Forgot Password?</h5>
                    <p className="text-muted">Reset password with velzon</p>
                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    ></lord-icon>
                  </div>

                  <Alert
                    className="border-0 alert-warning text-center mb-2 mx-2"
                    role="alert"
                  >
                    {submitted
                      ? "Enter the OTP and your new password."
                      : "Enter your email and instructions will be sent to you!"}
                  </Alert>

                  <div className="p-2">
                    {forgetError && (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    )}
                    {forgetSuccessMsg && (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    )}

                    <Form onSubmit={validation.handleSubmit}>
                      {/* Email */}
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter email"
                          {...validation.getFieldProps("email")}
                          invalid={
                            validation.touched.email &&
                            !!validation.errors.email
                          }
                          disabled={submitted} // 👈 Disable after OTP is sent
                        />
                        <FormFeedback>{validation.errors.email}</FormFeedback>
                      </div>

                      {/* Step 2 fields */}
                      {submitted && (
                        <>
                          <div className="mb-4">
                            <Label className="form-label">OTP</Label>
                            <Input
                              name="otp"
                              placeholder="Enter OTP"
                              {...validation.getFieldProps("otp")}
                              invalid={
                                validation.touched.otp &&
                                !!validation.errors.otp
                              }
                            />
                            <FormFeedback>{validation.errors.otp}</FormFeedback>
                          </div>

                          <div className="mb-4">
                            <Label className="form-label">New Password</Label>
                            <Input
                              name="newPassword"
                              type="password"
                              placeholder="Enter new password"
                              {...validation.getFieldProps("newPassword")}
                              invalid={
                                validation.touched.newPassword &&
                                !!validation.errors.newPassword
                              }
                            />
                            <FormFeedback>
                              {validation.errors.newPassword}
                            </FormFeedback>
                          </div>

                          <div className="mb-4">
                            <Label className="form-label">
                              Confirm Password
                            </Label>
                            <Input
                              name="confirmPassword"
                              type="password"
                              placeholder="Confirm new password"
                              {...validation.getFieldProps("confirmPassword")}
                              invalid={
                                validation.touched.confirmPassword &&
                                !!validation.errors.confirmPassword
                              }
                            />
                            <FormFeedback>
                              {validation.errors.confirmPassword}
                            </FormFeedback>
                          </div>
                        </>
                      )}

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">
                          {submitted ? "Reset Password" : "Send OTP"}
                        </button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">
                  Wait, I remember my password...{" "}
                  <Link
                    to="/login"
                    className="fw-semibold text-primary text-decoration-underline"
                  >
                    Click here
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default ForgetPasswordPage;
