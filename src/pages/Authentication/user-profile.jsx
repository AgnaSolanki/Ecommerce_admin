import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Form,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import avatar from "../../assets/images/users/user-dummy-img.jpg";
import BaseInput from "../../Components/BASE/BaseInput";
import BaseButton from "../../Components/BASE/BaseButton";
import userApi from "../../api/userApi";
import { CONSTANTS } from "../../Components/constants/common";
import { AiOutlineEdit } from "react-icons/ai";
import {
  inputField,
  postalCodeRegex,
  selectLabel,
  validationField,
} from "../../Components/constants/validation";
import BaseFileInput from "../../Components/BASE/BaseFileInput";
import BaseRadioInput from "../../Components/BASE/BaseRadioInput";
import BaseSelectInput from "../../Components/BASE/BaseSelectInput";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [idx] = useState("1");
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [role, setRole] = useState("");

  const [userProfile, setUserProfile] = useState({
    first_name: "",
    phone: "",
    gender: "",
    role: "",
    email: "",
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
  const genderValidation = validationField(CONSTANTS.gender);
  const postalCodeValidation = validationField(CONSTANTS.postalCode);
  const phoneValidation = validationField(CONSTANTS.phone);
  const addressValidation = validationField(CONSTANTS.address_line1);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userProfile,
    validationSchema: Yup.object({
      first_name: Yup.string().required(firstNameValidation.required),
      phone: Yup.string().required(phoneValidation.required),
      gender: Yup.string().required(genderValidation.required),
      country: Yup.string().required(countryValidation.required),
      state: Yup.string().required(stateValidation.required),
      city: Yup.string().required(cityValidation.required),
      address_line1: Yup.string().required(addressValidation.required),
      address_line2: Yup.string(),
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

        const imagePath = selectedImage || avatarPreview;

        const payload = {
          name: values.first_name,
          email: values.email,
          phone_number: values.phone,
          role: values.role,
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
        setAvatarPreview(imagePath); 
        setIsEditing(false);

        setError("");
      } catch (error) {
        toast.error(error.message);
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
        toast.error(err.message);
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
        toast.error(err.message);
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
        toast.error(err.message);
      }
    };
    fetchCities();
  }, [formik.values.state]);

  const fetchProfile = async () => {
    try {
      const res = await userApi.viewProfile();
      const profile = res.data?.data;
      setRole(profile.role);

      const userProfileData = {
        first_name: profile.name || "",
        phone: profile.phone_number || "",
        gender: profile.gender || "",
        email: profile.email,
        country: profile.address?.country_id?.toString() || "",
        state: profile.address?.state_id?.toString() || "",
        city: profile.address?.city_id?.toString() || "",
        address_line1: profile.address?.address_line1 || "",
        address_line2: profile.address?.address_line2 || "",
        postal_code: profile.address?.postal_code?.toString() || "",
        idx: idx,
        profile_image: profile.profile_image,
      };
      setUserProfile(userProfileData);
      formik.setValues(userProfileData);

      const fileName = profile.profile_image || "";
      const imagePath = fileName
        ? `${import.meta.env.VITE_BASE_IMAGE}${fileName}`
        : avatar;

      setSelectedImage(fileName);
      setAvatarPreview(imagePath);
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    formik.setValues(userProfile);
  }, [userProfile]);
  useEffect(() => {
    fetchProfile();
  }, []);
  const onFileChange = async (file) => {
    if (file) {
      try {
        const uploadRes = await userApi.fileUpload(file);
        const fileData = uploadRes.data?.data;
        const fileName = Array.isArray(fileData) ? fileData[0] : fileData;

        if (fileName) {
          setSelectedImage(fileName);
          const imageURL = `${import.meta.env.VITE_BASE_IMAGE}${fileName}`;
          setAvatarPreview(imageURL);
        }
      } catch (err) {
        toast.error(err.message);
      }
    }
  };
  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const uploadRes = await userApi.fileUpload(file);
        const fileData = uploadRes.data?.data;
        const fileName = Array.isArray(fileData) ? fileData[0] : fileData;

        if (fileName) {
          setSelectedImage(fileName);
          const imageURL = `${import.meta.env.VITE_BASE_IMAGE}${fileName}`;
          setAvatarPreview(imageURL);
        }
      } catch (err) {
        toast.error(err.message);
      }
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
                  <div className="profile-user position-relative d-inline-block mx-auto mb-4 user-img">
                    <img
                      src={avatarPreview}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = avatar;
                      }}
                      className="rounded-circle avatar-md img-thumbnail user-profile-image "
                      alt="user-avatar"
                    />

                    {isEditing && (
                      <>
                        <label htmlFor="avatar-upload" className="img-avatar">
                          <AiOutlineEdit className="text-size" />
                          <BaseFileInput
                            id="avatar-upload"
                            name="avatar"
                            value={formik.values[CONSTANTS.file]}
                            type={CONSTANTS.file}
                            onChange={handleFileInputChange}
                            onBlur={formik.handleBlur}
                            isAvatarUpload={true}
                            onFileChange={onFileChange}
                            required={true}
                          />
                          {formik.touched.file && formik.errors.file ? (
                            <FormFeedback className="d-block">
                              {formik.errors.file}
                            </FormFeedback>
                          ) : null}
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
                      <p className="mb-1">Email Id: {userProfile.email}</p>
                      <p className="mb-0">Id No: {userProfile.idx}</p>
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
                    onChange={formik.handleChange}
                    placeholder={inputField(CONSTANTS.firstName)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    required={true}
                    value={formik.values.first_name}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <FormFeedback className="d-block">
                      {formik.errors.first_name}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.phone}
                    name={CONSTANTS.phone}
                    label={CONSTANTS.phone_number}
                    type={CONSTANTS.text}
                    onChange={formik.handleChange}
                    placeholder={inputField(CONSTANTS.phone_number)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    required={true}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <FormFeedback className="d-block">
                      {formik.errors.phone}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6}>
                  <BaseRadioInput
                    id={CONSTANTS.gender}
                    name={CONSTANTS.gender}
                    label={CONSTANTS.Gender}
                    value={formik.values.gender}
                    type={CONSTANTS.radio}
                    options={[
                      { value: CONSTANTS.male, label: CONSTANTS.Male },
                      { value: CONSTANTS.female, label: CONSTANTS.Female },
                      { value: CONSTANTS.other, label: CONSTANTS.Other },
                    ]}
                    disabled={!isEditing}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required={true}
                  />
                  {formik.touched.gender && formik.errors.gender ? (
                    <FormFeedback className="d-block">
                      {formik.errors.gender}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.role}
                    name={CONSTANTS.role}
                    label={CONSTANTS.Role}
                    value={role}
                    type={CONSTANTS.text}
                    onChange={formik.handleChange}
                    disabled={true}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col md={4}>
                  <BaseSelectInput
                    id={CONSTANTS.country}
                    name={CONSTANTS.country}
                    label={CONSTANTS.Country}
                    value={formik.values.country}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { label: selectLabel(CONSTANTS.Country), value: "" },
                      ...countries.map((c) => ({
                        label: c.country_name,
                        value: c.id,
                      })),
                    ]}
                    disabled={!isEditing}
                    required={true}
                  />
                  {formik.touched.country && formik.errors.country ? (
                    <FormFeedback className="d-block">
                      {formik.errors.country}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={4}>
                  <BaseSelectInput
                    id={CONSTANTS.state}
                    name={CONSTANTS.state}
                    value={formik.values.state}
                    label={CONSTANTS.state}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { label: selectLabel(CONSTANTS.State), value: "" },
                      ...states.map((s) => ({
                        label: s.state_name,
                        value: s.id,
                      })),
                    ]}
                    disabled={!isEditing}
                    required={true}
                  />
                  {formik.touched.state && formik.errors.state ? (
                    <FormFeedback className="d-block">
                      {formik.errors.state}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={4}>
                  <BaseSelectInput
                    id={CONSTANTS.city}
                    name={CONSTANTS.city}
                    value={formik.values.city}
                    label={CONSTANTS.City}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={[
                      { label: selectLabel(CONSTANTS.City), value: "" },
                      ...cities.map((ci) => ({
                        label: ci.city_name,
                        value: ci.id,
                      })),
                    ]}
                    formik={formik}
                    disabled={!isEditing}
                    required={true}
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <FormFeedback className="d-block">
                      {formik.errors.city}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={12}>
                  <BaseInput
                    id={CONSTANTS.address_line1}
                    name={CONSTANTS.address_line1}
                    label={CONSTANTS.addressLabel1}
                    value={formik.values.address_line1}
                    onChange={formik.handleChange}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.address_line1)}
                    formik={formik}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    required={true}
                  />
                  {formik.touched.address_line1 &&
                  formik.errors.address_line1 ? (
                    <FormFeedback className="d-block">
                      {formik.errors.address_line1}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={12}>
                  <BaseInput
                    id={CONSTANTS.address_line2}
                    name={CONSTANTS.address_line2}
                    label={CONSTANTS.addressLabel2}
                    value={formik.values.address_line2}
                    onChange={formik.handleChange}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.address_line2)}
                    formik={formik}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col md={6}>
                  <BaseInput
                    id={CONSTANTS.postal_code}
                    name={CONSTANTS.postal_code}
                    label={CONSTANTS.Postal_code}
                    value={formik.values.postal_code}
                    onChange={formik.handleChange}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.Postal_code)}
                    formik={formik}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    required={true}
                  />
                  {formik.touched.postal_code && formik.errors.postal_code ? (
                    <FormFeedback className="d-block">
                      {formik.errors.postal_code}
                    </FormFeedback>
                  ) : null}
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
