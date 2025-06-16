import { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
  Alert,
} from "reactstrap";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../Authentication/ParticlesAuth";
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
import userApi from "../../api/userApi";
import BaseButton from "../../Components/BASE/BaseButton";
import Footer from "../../Layouts/Footer";

const ForgetPasswordPage = () => {
const [passwordShow, setPasswordShow] = useState(false);
const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
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
        .required(passwordValidation.required)
        .min(8, passwordValidation.passwordMinLength)
        .matches(passwordRegex, passwordValidation.passwordComplexity),

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
          const response = await userApi.verifyEmail({
            email: values[CONSTANTS.email],
          });
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
          const response = await userApi.forgotPassword({
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
  const blockSpace = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  document.title = "forgot-password";

  return (
    <ParticlesAuth>
      <div className="auth-page-content">
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
                    <h5 className="text-primary welcome-text">
                      Forgot Password?
                    </h5>

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
                    Enter your email and instructions will be sent to you!
                  </Alert>

                  <div className="p-2">
                    <Form onSubmit={validation.handleSubmit}>
                      <div className="mb-4">
                        <BaseInput
                          id={CONSTANTS.email}
                          name={CONSTANTS.email}
                          label={CONSTANTS.Email}
                          type={CONSTANTS.email}
                          onKeyDown={blockSpace}
                          placeholder={inputField(CONSTANTS.Email)}
                          disabled={submitted}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          required={true}
                          className={submitted ? "cursor-not-allowed" : ""}
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback className="d-block">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>

                      {submitted && (
                        <>
                          <div className="mb-3">
                            <BaseInput
                              id={CONSTANTS.otp}
                              name={CONSTANTS.otp}
                              label={CONSTANTS.OTP}
                              type={CONSTANTS.text}
                              placeholder={inputField(CONSTANTS.OTP)}
                              onChange={handleOtpChange}
                              onBlur={validation.handleBlur}
                              maxLength={6}
                              required={true}
                              value={validation.values[CONSTANTS.otp]}
                            />
                            {validation.touched.otp &&
                              validation.errors.otp && (
                                <FormFeedback className="d-block">
                                  {validation.errors.otp}
                                </FormFeedback>
                              )}
                          </div>
                          <div className="mb-3">
                            <BaseInput
                              id={CONSTANTS.newPassword}
                              name={CONSTANTS.newPassword}
                              label={CONSTANTS.Password}
                              type={CONSTANTS.password}
                              placeholder={inputField(CONSTANTS.Password)}
                              showPasswordToggle={true}
                              passwordShown={passwordShow}
                              onKeyDown={blockSpace}
                              setPasswordShown={setPasswordShow}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              required={true}
                            />
                            {validation.touched.newPassword &&
                              validation.errors.newPassword && (
                                <FormFeedback className="d-block">
                                  {validation.errors.newPassword}
                                </FormFeedback>
                              )}
                          </div>
                          <BaseInput
                            id={CONSTANTS.confirmPassword}
                            name={CONSTANTS.confirmPassword}
                            label={CONSTANTS.Confirmpassword}
                            type={CONSTANTS.password}
                            placeholder={inputField(CONSTANTS.ConfirmPassword)}
                            showPasswordToggle={true}
                            passwordShown={confirmPasswordShow}
                            onKeyDown={blockSpace}
                            setPasswordShown={setConfirmPasswordShow}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            required={true}
                          />
                          {validation.touched.confirmPassword &&
                            validation.errors.confirmPassword && (
                              <FormFeedback className="d-block">
                                {validation.errors.confirmPassword}
                              </FormFeedback>
                            )}
                        </>
                      )}

                      <div className="text-center mt-4">
                        <BaseButton
                          type="submit"
                          color="success"
                          block={true}
                          loading={loading}
                          disabled={!!error || loading}
                        >
                          {!loading
                            ? submitted
                              ? "Reset Password"
                              : "Send OTP"
                            : null}
                        </BaseButton>
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
        <div className="main-content mb-0 mt-5">
          <Footer />
        </div>
      </div>
    </ParticlesAuth>
  );
};

export default ForgetPasswordPage;
