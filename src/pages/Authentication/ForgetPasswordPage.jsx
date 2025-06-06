import React, { useState } from "react";
import { Row, Col, Card, CardBody, Container, Form } from "reactstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../Authentication/ParticlesAuth";
import authService from "../../api/apiServices";
import { CONSTANTS } from "../../Components/constants/common";
import { LoginRoutes } from "../../Routes/apiRoutes";
import BaseInput from "../../Components/BASE/BaseInput";
import {
  emailRegex,
  inputField,
  otpRegex,
  passwordRegex,
  validationField,
} from "../../Components/constants/validation";

const ForgetPasswordPage = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error] = useState("");
  const navigate = useNavigate();

  const emailValidation = validationField(CONSTANTS.Email);
  const otpValidation = validationField(CONSTANTS.OTP);
  const passwordValidation = validationField(CONSTANTS.Password);
  const confirmPasswordValidation = validationField(CONSTANTS.ConfirmPassword);

  const getValidationSchema = () => {
    if (!submitted) {
      return Yup.object({
        [CONSTANTS.email]: Yup.string()
          .matches(emailRegex, emailValidation.format(CONSTANTS.Email))
          .required(emailValidation.required),
      });
    }

    return Yup.object({
      [CONSTANTS.email]: Yup.string()
        .matches(emailRegex, emailValidation.format(CONSTANTS.Email))
        .required(emailValidation.required),

      [CONSTANTS.otp]: Yup.string()
        .matches(otpRegex, otpValidation.minLength(CONSTANTS.OTP, 6))
        .required(otpValidation.required),

      [CONSTANTS.newPassword]: Yup.string()
        .matches(passwordRegex, passwordValidation.passwordPattern)
        .required(passwordValidation.required),

      [CONSTANTS.confirmPassword]: Yup.string()
        .oneOf(
          [Yup.ref(CONSTANTS.newPassword)],
          confirmPasswordValidation.passwordsMatch(
            CONSTANTS.ConfirmPassword,
            CONSTANTS.ConfirmPassword
          )
        )
        .required(confirmPasswordValidation.required),
    });
  };

  const validation = useFormik({
    initialValues: {
      [CONSTANTS.email]: "",
      [CONSTANTS.otp]: "",
      [CONSTANTS.newPassword]: "",
      [CONSTANTS.confirmPassword]: "",
    },

    validationSchema: () => getValidationSchema(),
    onSubmit: async (values) => {
      setLoading(true);
      if (!submitted) {
        try {
          const response = await authService.verifyEmail(
            values[CONSTANTS.email]
          );
          toast.success(response?.data.message);
          setSubmitted(true);
          validation.setTouched({});
        } catch (error) {
          toast.error(error?.response?.data?.message || error?.message);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          const response = await authService.forgotPassword({
            email: values[CONSTANTS.email],
            otp: Number(values[CONSTANTS.otp]),
            newPassword: values[CONSTANTS.newPassword],
            confirmPassword: values[CONSTANTS.confirmPassword],
          });
          toast.success(response?.data.message);
          setTimeout(() => {
            navigate(LoginRoutes.LOGIN);
          }, 1500);
        } catch (error) {
          toast.error(error?.response?.data?.message);
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (otpRegex.test(value)) {
      validation.handleChange(e);
    }
  };

  document.title = "forgot-password";

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
                      className="avatar-xl lord-icon"
                    ></lord-icon>
                  </div>

                  <div className="p-2">
                    <Form onSubmit={validation.handleSubmit}>
                      {/* Email */}
                      <div className="mb-4">
                        <BaseInput
                          id={CONSTANTS.email}
                          name={CONSTANTS.email}
                          label={CONSTANTS.Email}
                          type={CONSTANTS.email}
                          placeholder={inputField(CONSTANTS.Email)}
                          formik={validation}
                          onChange={validation.handleChange}
                          disabled={submitted}
                     
                        />
                      </div>

                      {/* Step 2 fields */}
                      {submitted && (
                        <>
                          <BaseInput
                            id={CONSTANTS.otp}
                            name={CONSTANTS.otp}
                            label={CONSTANTS.OTP}
                            type={CONSTANTS.text}
                            placeholder={inputField(CONSTANTS.OTP)}
                            formik={validation}
                            isOtp={true}
                            onChange={handleOtpChange}
                          />

                          <BaseInput
                            id={CONSTANTS.newPassword}
                            name={CONSTANTS.newPassword}
                            label={CONSTANTS.Password}
                            type={CONSTANTS.password}
                            placeholder={inputField(CONSTANTS.Password)}
                            formik={validation}
                            showPasswordToggle={true}
                            passwordShown={passwordShow}
                            onChange={validation.handleChange}
                            setPasswordShown={setPasswordShow}
                          
                          />

                          <BaseInput
                            id={CONSTANTS.confirmPassword}
                            name={CONSTANTS.confirmPassword}
                            label={CONSTANTS.ConfirmPassword}
                            type={CONSTANTS.password}
                            placeholder={inputField(CONSTANTS.ConfirmPassword)}
                            formik={validation}
                            showPasswordToggle={true}
                            passwordShown={passwordShow}
                            onChange={validation.handleChange}
                            setPasswordShown={setPasswordShow}
                         
                          />
                        </>
                      )}

                      <div className="text-center mt-4">
                        <button
                          disabled={!!error || loading}
                          className="btn btn-success w-100"
                          type="submit"
                        >
                          {loading && (
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                          )}
                          {!loading
                            ? submitted
                              ? "Reset Password"
                              : "Send OTP"
                            : null}
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
