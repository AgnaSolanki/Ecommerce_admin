import React, { useState } from "react";
import {
  Row,
  Col,
  Alert,
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
} from "reactstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../Authentication/ParticlesAuth";
import authService from "../../api/apiServices";
import { CONSTANTS } from "../../Components/constants/common";
import { LoginRoutes } from "../../Routes/Constant";
import BaseInput from "../../Components/BASE/BaseInput";
import { validation } from "../../Components/constants/validation";

// Custom validation logic using validation(field)
const validateForgotPassword = (values, submitted) => {
  const errors = {};
  const emailValidation = validation("Email");
  const otpValidation = validation("OTP");
  const newPasswordValidation = validation("Password");
  const confirmPasswordValidation = validation("Confirm Password");

  if (!values[CONSTANTS.email]) {
    errors[CONSTANTS.email] = emailValidation.required;
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values[CONSTANTS.email])
  ) {
    errors[CONSTANTS.email] = emailValidation.invalidEmail;
  }

  if (submitted) {
    if (!values[CONSTANTS.otp]) {
      errors[CONSTANTS.otp] = otpValidation.otpRequired;
    } else if (!/^\d{6}$/.test(values[CONSTANTS.otp])) {
      errors[CONSTANTS.otp] = otpValidation.otpSixDigits;
    }

    if (!values[CONSTANTS.newPassword]) {
      errors[CONSTANTS.newPassword] = newPasswordValidation.required;
    } else if (values[CONSTANTS.newPassword].length < 8) {
      errors[CONSTANTS.newPassword] = newPasswordValidation.minLength(8);
    } else if (!/[A-Z]/.test(values[CONSTANTS.newPassword])) {
      errors[CONSTANTS.newPassword] = newPasswordValidation.passwordPattern;
    }

    if (!values[CONSTANTS.confirmPassword]) {
      errors[CONSTANTS.confirmPassword] = confirmPasswordValidation.required;
    } else if (
      values[CONSTANTS.confirmPassword] !== values[CONSTANTS.newPassword]
    ) {
      errors[CONSTANTS.confirmPassword] =
        confirmPasswordValidation.passwordsMustMatch;
    }
  }

  return errors;
};

const ForgetPasswordPage = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const validation = useFormik({
    initialValues: {
      [CONSTANTS.email]: "",
      [CONSTANTS.otp]: "",
      [CONSTANTS.newPassword]: "",
      [CONSTANTS.confirmPassword]: "",
    },
    validate: (values) => validateForgotPassword(values, submitted),
    onSubmit: async (values) => {
      if (!submitted) {
        try {
          const response = await authService.sendOtpToEmail(
            values[CONSTANTS.email]
          );
          toast.success(response?.message);
          setSubmitted(true);
        } catch (error) {
          toast.error(error?.response?.data?.message || error?.message);
        }
      } else {
        try {
          const response = await authService.changePassword({
            email: values[CONSTANTS.email],
            otp: Number(values[CONSTANTS.otp]),
            newPassword: values[CONSTANTS.newPassword],
            confirmPassword: values[CONSTANTS.confirmPassword],
          });

          toast.success(response?.message);
          setTimeout(() => {
            navigate(LoginRoutes.LOGIN);
          }, 1500);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      }
    },
  });

  document.title =
    "forgot-password | Velzon - React Admin & Dashboard Template";

  return (
    <ParticlesAuth>
      <div className="auth-page-content mt-lg-5">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link
                    to={LoginRoutes.Home}
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
                    <h5 className="text-primary">Forgot Password?</h5>
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
                        <BaseInput
                          id={CONSTANTS.email}
                          name={CONSTANTS.email}
                          label={CONSTANTS.Email}
                          type={CONSTANTS.email}
                          placeholder={CONSTANTS.EmailPlaceholder}
                          formik={validation}
                          disabled={submitted}
                        />
                        {validation.errors.email &&
                          validation.touched.email && (
                            <FormFeedback className="d-block">
                              {validation.errors.email}
                            </FormFeedback>
                          )}
                      </div>

                      {/* Step 2 fields */}
                      {submitted && (
                        <>
                          <BaseInput
                            id={CONSTANTS.otp}
                            name={CONSTANTS.otp}
                            label={CONSTANTS.OTP}
                            type="text"
                            placeholder={CONSTANTS.OTPPlaceholder}
                            formik={validation}
                          />
                          {validation.errors.otp && validation.touched.otp && (
                            <FormFeedback className="d-block">
                              {validation.errors.otp}
                            </FormFeedback>
                          )}

                          <BaseInput
                            id={CONSTANTS.newPassword}
                            name={CONSTANTS.newPassword}
                            label={CONSTANTS.NewPassword}
                            type="password"
                            placeholder={CONSTANTS.NewPasswordPlaceholder}
                            formik={validation}
                            showPasswordToggle={true}
                            passwordShown={passwordShow}
                            setPasswordShown={setPasswordShow}
                          />
                          {validation.errors.newPassword &&
                            validation.touched.newPassword && (
                              <FormFeedback className="d-block">
                                {validation.errors.newPassword}
                              </FormFeedback>
                            )}

                          <BaseInput
                            id={CONSTANTS.confirmPassword}
                            name={CONSTANTS.confirmPassword}
                            label={CONSTANTS.ConfirmPassword}
                            type={CONSTANTS.password}
                            placeholder={CONSTANTS.ConfirmPasswordPlaceholder}
                            formik={validation}
                            showPasswordToggle={true}
                            passwordShown={passwordShow}
                            setPasswordShown={setPasswordShow}
                          />
                          {validation.errors.confirmPassword &&
                            validation.touched.confirmPassword && (
                              <FormFeedback className="d-block">
                                {validation.errors.confirmPassword}
                              </FormFeedback>
                            )}
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
                    to={LoginRoutes.LOGIN}
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
