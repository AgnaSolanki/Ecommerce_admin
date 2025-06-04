import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Form,
} from "reactstrap";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import avatar from "../../assets/images/users/user-dummy-img.jpg";
import BaseInput from "../../Components/BASE/BaseInput";
import { CONSTANTS } from "../../Components/constants/common";
import { inputField, validation } from "../../Components/constants/validation";

const validateProfile = (values) => {
  const errors = {};
  const nameValidation = validation("User Name");

  if (!values[CONSTANTS.firstName]) {
    errors[CONSTANTS.firstName] = nameValidation.required;
  }

  return errors;
};

const UserProfile = () => {
  const [userName, setUserName] = useState("Admin");
  const [email] = useState("admin@gmail.com");
  const [idx] = useState("1");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      [CONSTANTS.firstName]: userName,
      idx: idx,
    },
    validate: validateProfile,
    onSubmit: (values) => {
      setUserName(values[CONSTANTS.firstName]); // Update local state
      toast.success("User name updated successfully!");
    },
  });

  document.title = "Profile";

  return (
    <div className="page-content mt-lg-5">
      <Container fluid>
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div className="d-flex">
                  <div className="mx-3">
                    <img
                      src={avatar}
                      alt="user"
                      className="avatar-md rounded-circle img-thumbnail"
                    />
                  </div>
                  <div className="flex-grow-1 align-self-center">
                    <div className="text-muted">
                      <h5>{userName}</h5>
                      <p className="mb-1">Email Id: {email}</p>
                      <p className="mb-0">Id No: #{idx}</p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title mb-4">Change User Name</h4>

        <Card>
          <CardBody>
            <Form onSubmit={formik.handleSubmit}>
              <BaseInput
                id={CONSTANTS.first_name}
                name={CONSTANTS.first_name}
                label="User Name"
                type={CONSTANTS.text}
                placeholder={inputField("User Name")}
                formik={formik}
              />

              <input type="hidden" name="idx" value={idx} />

              <div className="text-center mt-4">
                <Button type="submit" color="danger">
                  Update User Name
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;
