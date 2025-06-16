import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Form,
  FormFeedback,
} from "reactstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CONSTANTS } from "../../Components/constants/common";
import { LoginRoutes } from "../../Routes/apiRoutes";
import BaseInput from "../../Components/BASE/BaseInput";
import {
  inputField,
  passwordRegex,
  validationField,
} from "../../Components/constants/validation";
import userApi from "../../api/userApi";
import BaseButton from "../../Components/BASE/BaseButton";

const ForgetPasswordPage = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const sessionEmail = sessionStorage.getItem(CONSTANTS.email);
    if (sessionEmail) {
      setEmail(sessionEmail);
    } else {
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
      setError("");

      try {
        const response = await userApi.changePassword({
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
                        placeholder={inputField(CONSTANTS.Email)}
                        value={email}
                        disabled={true}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className="cursor-not-allowed"
                      />
                    </div>

                    <BaseInput
                      id={CONSTANTS.currentPassword}
                      name={CONSTANTS.currentPassword}
                      label={CONSTANTS.Current_password}
                      type={CONSTANTS.password}
                      placeholder={inputField(CONSTANTS.CurrentPassword)}
                      showPasswordToggle={true}
                      passwordShown={passwordShow}
                      setPasswordShown={setPasswordShow}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      required={true}
                    />
                    {validation.touched.currentPassword &&
                    validation.errors.currentPassword ? (
                      <FormFeedback className="d-block">
                        {validation.errors.currentPassword}
                      </FormFeedback>
                    ) : null}

                    <BaseInput
                      id={CONSTANTS.newPassword}
                      name={CONSTANTS.newPassword}
                      label={CONSTANTS.New_password}
                      type={CONSTANTS.password}
                      placeholder={inputField(CONSTANTS.NewPassword)}
                      showPasswordToggle={true}
                      passwordShown={passwordShow}
                      setPasswordShown={setPasswordShow}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      required={true}
                    />
                    {validation.touched.newPassword &&
                    validation.errors.newPassword ? (
                      <FormFeedback className="d-block">
                        {validation.errors.newPassword}
                      </FormFeedback>
                    ) : null}
                    <BaseInput
                      id={CONSTANTS.confirmPassword}
                      name={CONSTANTS.confirmPassword}
                      label={CONSTANTS.Confirm_password}
                      type={CONSTANTS.password}
                      placeholder={inputField(CONSTANTS.ConfirmPassword)}
                      showPasswordToggle={true}
                      passwordShown={passwordShow}
                      setPasswordShown={setPasswordShow}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      required={true}
                    />
                    {validation.touched.confirmPassword &&
                    validation.errors.confirmPassword ? (
                      <FormFeedback className="d-block">
                        {validation.errors.confirmPassword}
                      </FormFeedback>
                    ) : null}

                    <div className="text-center mt-4">
                      <BaseButton
                        type="submit"
                        color="success"
                        block={true}
                        loading={loading}
                        disabled={!!error}
                      >
                        {!loading ? "Change Password" : null}
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
  );
};

export default ForgetPasswordPage;
