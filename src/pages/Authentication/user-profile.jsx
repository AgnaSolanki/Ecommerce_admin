import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import avatar from "../../assets/images/users/user-dummy-img.jpg";

const UserProfile = () => {
  const [userName, setUserName] = useState("Admin");
  const [email] = useState("admin@gmail.com");
  const [idx] = useState("1");
  const [showSuccess, setShowSuccess] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userName,
      idx: idx,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please enter your user name"),
    }),
    onSubmit: (values) => {
      setUserName(values.first_name); // update local state
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // hide alert after 3s
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
            {showSuccess && (
              <Alert color="success">User name updated successfully!</Alert>
            )}
            <Form onSubmit={formik.handleSubmit}>
              <div className="form-group">
                <Label className="form-label">User Name</Label>
                <Input
                  name="first_name"
                  type="text"
                  className="form-control"
                  placeholder="Enter User Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name}
                  invalid={
                    formik.touched.first_name && !!formik.errors.first_name
                  }
                />
                {formik.touched.first_name && formik.errors.first_name && (
                  <FormFeedback>{formik.errors.first_name}</FormFeedback>
                )}
              </div>
              <Input name="idx" value={idx} type="hidden" />
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
