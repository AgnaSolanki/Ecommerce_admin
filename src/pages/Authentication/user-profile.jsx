import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Input, Form } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import avatar from "../../assets/images/users/user-dummy-img.jpg";
import BaseInput from "../../Components/BASE/BaseInput";
import BaseButton from "../../Components/BASE/BaseButton";
import userApi from "../../api/userApi";

const UserProfile = () => {
  const [userName, setUserName] = useState("Admin");
  const [email] = useState("admin@gmail.com");
  const [idx] = useState("1");
  const [showSuccess, setShowSuccess] = useState(false);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: userName,
      phone: "",
      gender: "",
      role: "",
      country: "",
      state: "",
      city: "",
      address_line1: "",
      address_line2: "",
      postal_code: "",
      idx: idx,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required("Please enter your user name"),
      country: Yup.string().required("Please select your country"),
      state: Yup.string().required("Please select your state"),
      city: Yup.string().required("Please select your city"),
    }),
    onSubmit: async (values) => {
      const payload = {
        name: values.first_name,
        email: email,
        phone_number: values.phone,
        gender: values.gender,
        profile_image: "./",
        address: {
          country_id: values.country,
          state_id: values.state,
          city_id: values.city,
          postal_code: parseInt(values.postal_code, 10),
          label: "home",
          address_line1: values.address_line1,
          address_line2: values.address_line2,
        },
      };

      try {
        const response = await userApi.updateProfile(payload);
        console.log("API response:", response);
        setUserName(values.first_name);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error("Update failed:", error);
      }
    },
  });

    // Fetch list of countries on mount
useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await userApi.getCountries();
      setCountries(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch countries", err);
    }
  };
  fetchCountries();
}, []);

  // Fetch states whenever country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formik.values.country) {
        setStates([]);
        setCities([]);
        return;
      }
      try {
        const res = await userApi.getStates(formik.values.country);
        // Assuming res.data is an array of { id, name }
        setStates(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to fetch states", err);
      }
    };
    fetchStates();
  }, [formik.values.country]);

  // Fetch cities whenever state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formik.values.state) {
        setCities([]);
        return;
      }
      try {
        const res = await userApi.getCities(formik.values.state);
        // Assuming res.data is an array of { id, name }
        setCities(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      }
    };
    fetchCities();
  }, [formik.values.state]);

  document.title = "Profile";

  return (
    <div className="page-content mt-lg-5 w-100">
      <Container fluid>
        <div className="d-flex justify-content-end m-3">
          <BaseButton color="primary" size="sm">
            Edit Profile
          </BaseButton>
        </div>

        {showSuccess && (
          <div className="alert alert-success text-center" role="alert">
            Profile updated successfully!
          </div>
        )}

        <Row>
          <Col lg="12">
            <Card className="position-relative">
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

        <Card>
          <CardBody>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <BaseInput
                    id="first_name"
                    name="first_name"
                    label="User Name"
                    type="text"
                    placeholder="Enter User Name"
                    formik={formik}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id="phone"
                    name="phone"
                    label="Phone Number"
                    type="text"
                    placeholder="Enter Phone Number"
                    formik={formik}
                  />
                </Col>

                <Col md={6}>
                  <label className="form-label d-block">Gender</label>
                  <div className="d-flex gap-3">
                    {["male", "female", "other"].map((g) => (
                      <div key={g} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id={`gender-${g}`}
                          value={g}
                          checked={formik.values.gender === g}
                          onChange={formik.handleChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`gender-${g}`}
                        >
                          {g.charAt(0).toUpperCase() + g.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formik.touched.gender && formik.errors.gender && (
                    <div className="text-danger">{formik.errors.gender}</div>
                  )}
                </Col>

                <Col md={6}>
                  <BaseInput
                    id="role"
                    name="role"
                    label="Role"
                    type="select"
                    options={[
                      { label: "Select Role", value: "" },
                      { label: "Customer", value: "customer" },
                      { label: "Admin", value: "admin" },
                    ]}
                    formik={formik}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id="country"
                    name="country"
                    label="Country"
                    type="select"
                    options={[
                      { label: "Select Country", value: "" },
                      ...countries.map((c) => ({
                        label: c.country_name,
                        value: c.id,
                      })),
                    ]}
                    formik={formik}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id="state"
                    name="state"
                    label="State"
                    type="select"
                    options={[
                      { label: "Select State", value: "" },
                      ...states.map((s) => ({
                        label: s.state_name,
                        value: s.id,
                      })),
                    ]}
                    formik={formik}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id="city"
                    name="city"
                    label="City"
                    type="select"
                    options={[
                      { label: "Select City", value: "" },
                      ...cities.map((ci) => ({
                        label: ci.city_name,
                        value: ci.id,
                      })),
                    ]}
                    formik={formik}
                  />
                </Col>

                <Col md={12}>
                  <BaseInput
                    id="address_line1"
                    name="address_line1"
                    label="Address Line 1"
                    type="text"
                    placeholder="Enter Address Line 1"
                    formik={formik}
                  />
                </Col>

                <Col md={12}>
                  <BaseInput
                    id="address_line2"
                    name="address_line2"
                    label="Address Line 2"
                    type="text"
                    placeholder="Enter Address Line 2"
                    formik={formik}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id="postal_code"
                    name="postal_code"
                    label="Postal Code"
                    type="number"
                    placeholder="Enter Postal Code"
                    formik={formik}
                  />
                </Col>
              </Row>

              <Input name="idx" value={idx} type="hidden" />

              <div className="text-center mt-4">
                <BaseButton type="submit" color="danger">
                  Update Profile
                </BaseButton>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;
