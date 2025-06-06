import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Input, Form } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import avatar from "../../assets/images/users/user-dummy-img.jpg";
import BaseInput from "../../Components/BASE/BaseInput";
import BaseButton from "../../Components/BASE/BaseButton";
import userApi from "../../api/userApi";
import { CONSTANTS } from "../../Components/constants/common";
import {
  inputField,
  postalCodeRegex,
  selectLabel,
  validationField,
} from "../../Components/constants/validation";

const UserProfile = () => {
  const [idx] = useState("1");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem(CONSTANTS.user);
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserEmail(parsedUser.email || "");
        setUserRole(parsedUser.role);
      } catch (err) {
        console.error(err);
      }
    }
  }, [userRole]);

  const [userProfile, setUserProfile] = useState({
    first_name: "",
    phone: "",
    gender: "",
    role: userRole,
    country: "",
    state: "",
    city: "",
    address_line1: "",
    address_line2: "",
    postal_code: "",
    idx: idx,
  });

  const firstNameValidation = validationField(CONSTANTS.first_name);
  const countryValidation = validationField(CONSTANTS.country);
  const cityValidation = validationField(CONSTANTS.city);
  const stateValidation = validationField(CONSTANTS.state);
  const postalCodeValidation = validationField(CONSTANTS.postalCode);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userProfile,
    validationSchema: Yup.object({
      first_name: Yup.string().required(firstNameValidation.required),
      country: Yup.string().required(countryValidation.required),
      state: Yup.string().required(stateValidation.required),
      city: Yup.string().required(cityValidation.required),
      postal_code: Yup.string()
        .matches(
          postalCodeRegex,
          postalCodeValidation.minLength(CONSTANTS.postalCode, 6)
        )
        .required(postalCodeValidation.required)
        .max(6, postalCodeValidation.maxLength(CONSTANTS.postalCode, 6)),
    }),
    onSubmit: async (values) => {
      try {
        setSaveLoading(true);
        let imagePath = avatarPreview;
        if (selectedImage) {
          const uploadRes = await userApi.fileUpload(selectedImage);
          imagePath = uploadRes.data?.file_path || avatarPreview;
        }

        const payload = {
          name: values.first_name,
          email: userEmail,
          phone_number: values.phone,
          gender: values.gender,
          profile_image: imagePath,
          address: {
            country_id: +values.country,
            state_id: +values.state,
            city_id: +values.city,
            postal_code: parseInt(values.postal_code, 10),
            label: CONSTANTS.home,
            address_line1: values.address_line1,
            address_line2: values.address_line2,
          },
        };

        await userApi.updateProfile(payload);
        setUserProfile({ ...formik.values });
        setIsEditing(false);
        setError("");
      } catch (error) {
        console.error(error.message);
      } finally {
        setSaveLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await userApi.getCountries();
        setCountries(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (!formik.values.country) {
        setStates([]);
        setCities([]);
        return;
      }
      try {
        const res = await userApi.getStates(formik.values.country);
        setStates(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchStates();
  }, [formik.values.country]);
  useEffect(() => {
    const fetchCities = async () => {
      if (!formik.values.state) {
        setCities([]);
        return;
      }
      try {
        const res = await userApi.getCities(formik.values.state);
        setCities(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCities();
  }, [formik.values.state]);
  useEffect(() => {
    setUserProfile((prev) => ({
      ...prev,
      role: userRole || "",
    }));
  }, [userRole]);
  const fetchProfile = async () => {
    try {
      const res = await userApi.viewProfile();
      const profile = res.data?.data;

      setUserProfile({
        first_name: profile.name || "",
        phone: profile.phone_number || "",
        gender: profile.gender || "",
        role: profile.role || "",
        country: profile.address?.country_id?.toString() || "",
        state: profile.address?.state_id?.toString() || "",
        city: profile.address?.city_id?.toString() || "",
        address_line1: profile.address?.address_line1 || "",
        address_line2: profile.address?.address_line2 || "",
        postal_code: profile.address?.postal_code?.toString() || "",
        idx: idx,
      });

      setAvatarPreview(profile.profile_image || avatar);
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);
  const handlecodeChange = (e) => {
    const { value } = e.target;
    if (postalCodeRegex.test(value)) {
      formik.handleChange(e);
    }
  };

  document.title = "Profile";

  return (
    <div className="page-content mt-lg-5 w-100">
      <Container fluid>
        <div className="d-flex justify-content-end gap-2 m-3">
          {isEditing ? null : (
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </BaseButton>
          )}
        </div>

        <Row>
          <Col lg="12">
            <Card className="position-relative">
              <CardBody>
                <div className="d-flex">
                  <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                    <img
                      src={avatarPreview || avatar}
                      className="rounded-circle avatar-md img-thumbnail user-profile-image"
                      alt="user-avatar"
                    />

                    {isEditing && (
                      <>
                        <label htmlFor="avatar-upload" className="img-avatar">
                          <i className="ri-edit-2-fill text-size"></i>
                          <BaseInput
                            id="avatar-upload"
                            name="avatar"
                            type="file"
                            isAvatarUpload={true}
                            formik={formik}
                            onFileChange={(file) => {
                              if (file) {
                                setSelectedImage(file);
                                setAvatarPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>

                        {selectedImage && (
                          <div
                            className="image-close"
                            onClick={() => {
                              setSelectedImage(null);
                              setAvatarPreview(avatar);
                            }}
                            title="Remove Image"
                          >
                            <i className="ri-close-line close-icon" />
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex-grow-1 align-self-center">
                    <div className="text-muted">
                      <h5>{name}</h5>
                      <p className="mb-1">Email Id: {userEmail}</p>
                      <p className="mb-0">Id No: {idx}</p>
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
                    id={CONSTANTS.first_name}
                    name={CONSTANTS.first_name}
                    label={CONSTANTS.userName}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.firstName)}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.phone}
                    name={CONSTANTS.phone}
                    label={CONSTANTS.phone_number}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.phone_number)}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.gender}
                    name={CONSTANTS.gender}
                    label={CONSTANTS.Gender}
                    type={CONSTANTS.radio}
                    options={[
                      { value: CONSTANTS.male, label: CONSTANTS.Male },
                      { value: CONSTANTS.female, label: CONSTANTS.Female },
                      { value: CONSTANTS.other, label: CONSTANTS.Other },
                    ]}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.role}
                    name={CONSTANTS.role}
                    label={CONSTANTS.Role}
                    type={CONSTANTS.text}
                    formik={formik}
                    disabled={true}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id={CONSTANTS.country}
                    name={CONSTANTS.country}
                    label={CONSTANTS.Country}
                    type={CONSTANTS.select}
                    options={[
                      { label: selectLabel(CONSTANTS.Country), value: "" },
                      ...countries.map((c) => ({
                        label: c.country_name,
                        value: c.id,
                      })),
                    ]}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id={CONSTANTS.state}
                    name={CONSTANTS.state}
                    label={CONSTANTS.state}
                    type={CONSTANTS.select}
                    options={[
                      { label: selectLabel(CONSTANTS.State), value: "" },
                      ...states.map((s) => ({
                        label: s.state_name,
                        value: s.id,
                      })),
                    ]}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={4}>
                  <BaseInput
                    id={CONSTANTS.city}
                    name={CONSTANTS.city}
                    label={CONSTANTS.City}
                    type={CONSTANTS.select}
                    options={[
                      { label: selectLabel(CONSTANTS.City), value: "" },
                      ...cities.map((ci) => ({
                        label: ci.city_name,
                        value: ci.id,
                      })),
                    ]}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={12}>
                  <BaseInput
                    id={CONSTANTS.address_line1}
                    name={CONSTANTS.address_line1}
                    label={CONSTANTS.addressLabel1}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.address_line1)}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={12}>
                  <BaseInput
                    id={CONSTANTS.address_line2}
                    name={CONSTANTS.address_line2}
                    label={CONSTANTS.addressLabel2}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.address_line2)}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.postal_code}
                    name={CONSTANTS.postal_code}
                    label={CONSTANTS.Postal_code}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.Postal_code)}
                    formik={formik}
                    disabled={!isEditing}
                    onChange={handlecodeChange}
                  />
                </Col>
              </Row>

              <Input name="idx" value={idx} type="hidden" />
            </Form>
          </CardBody>
        </Card>
        <div className="d-flex justify-content-end gap-2 m-3">
          {isEditing ? (
            <>
              <BaseButton
                color="success"
                size="sm"
                type={CONSTANTS.submit}
                onClick={formik.handleSubmit}
                loading={saveLoading}
                disabled={!!error}
                onChange={formik.handleChange}
              >
                {!saveLoading ? "Save" : null}
              </BaseButton>
              <BaseButton
                type="button"
                color="secondary"
                size="sm"
                onClick={() => {
                  setCancelLoading(true);
                  fetchProfile().finally(() => {
                    setIsEditing(false);
                    setCancelLoading(false);
                  });
                }}
                loading={cancelLoading}
                disabled={!!error}
              >
                {!cancelLoading ? "Cancel" : null}
              </BaseButton>
            </>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default UserProfile;
