import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container, Form } from "reactstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import authService from "../../api/apiServices";
import { CONSTANTS } from "../../Components/constants/common";
import { LoginRoutes } from "../../Routes/apiRoutes";
import BaseInput from "../../Components/BASE/BaseInput";
import {
  inputField,
  passwordRegex,
  validationField,
} from "../../Components/constants/validation";

const ChangePasswordPage = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem(CONSTANTS.email);
    if (sessionEmail) {
      setEmail(sessionEmail);
    } else {
      toast.error("Email not found in session. Please login again.");
      navigate(LoginRoutes.LOGIN);
    }
  }, [navigate]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      [CONSTANTS.email]: email,
      [CONSTANTS.currentPassword]: "",
      [CONSTANTS.newPassword]: "",
      [CONSTANTS.confirmPassword]: "",
    },

    validationSchema: Yup.object({
      [CONSTANTS.currentPassword]: Yup.string()
        .matches(
          passwordRegex,
          validationField(CONSTANTS.Password).passwordPattern
        )
        .required(validationField(CONSTANTS.Password).required),

      [CONSTANTS.newPassword]: Yup.string()
        .matches(
          passwordRegex,
          validationField(CONSTANTS.Password).passwordPattern
        )
        .required(validationField(CONSTANTS.Password).required),

      [CONSTANTS.confirmPassword]: Yup.string()
        .oneOf(
          [Yup.ref(CONSTANTS.newPassword)],
          validationField(CONSTANTS.ConfirmPassword).passwordsMatch(
            CONSTANTS.ConfirmPassword,
            CONSTANTS.ConfirmPassword
          )
        )
        .required(validationField(CONSTANTS.ConfirmPassword).required),
    }),

    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await authService.changePassword({
          email,
          currentPassword: values[CONSTANTS.currentPassword],
          newPassword: values[CONSTANTS.newPassword],
          confirmPassword: values[CONSTANTS.confirmPassword],
        });
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate(LoginRoutes.LOGIN);
        }, 1500);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoading(false);
      }
    },
  });

  document.title = "Change Password";

  return (
    <div className="page-content mt-lg-5 w-100">
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="mt-4">
              <CardBody className="p-4">
                <div className="text-center mt-2">
                  <h5 className="text-primary">Change Your Password</h5>
                  <lord-icon
                    src="https://cdn.lordicon.com/rhvddzym.json"
                    trigger="loop"
                    colors="primary:#0ab39c"
                    className="avatar-xl lord-icon"
                  ></lord-icon>
                </div>

                <div className="p-2">
                  <Form onSubmit={validation.handleSubmit}>
                    <div className="mb-4">
                      <BaseInput
                        id={CONSTANTS.email}
                        name={CONSTANTS.email}
                        label={CONSTANTS.Email}
                        type={CONSTANTS.email}
                        formik={validation}
                        placeholder={inputField(CONSTANTS.Email)}
                        value={email}
                        disabled={true}
                      />
                    </div>

                    <BaseInput
                      id={CONSTANTS.currentPassword}
                      name={CONSTANTS.currentPassword}
                      label={CONSTANTS.CurrentPassword}
                      type={CONSTANTS.password}
                      placeholder={inputField(CONSTANTS.CurrentPassword)}
                      formik={validation}
                      showPasswordToggle={true}
                      passwordShown={passwordShow}
                      setPasswordShown={setPasswordShow}
                    />

                    <BaseInput
                      id={CONSTANTS.newPassword}
                      name={CONSTANTS.newPassword}
                      label={CONSTANTS.NewPassword}
                      type={CONSTANTS.password}
                      placeholder={inputField(CONSTANTS.NewPassword)}
                      formik={validation}
                      showPasswordToggle={true}
                      passwordShown={passwordShow}
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
                      setPasswordShown={setPasswordShow}
                    />

                    <div className="text-center mt-4">
                      <button
                        disabled={loading}
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
                        {!loading ? "Change Password" : null}
                      </button>
                    </div>
                  </Form>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChangePasswordPage;
