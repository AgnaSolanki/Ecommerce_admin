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
  onlyNum,
  selectLabel,
  validationField,
} from "../../Components/constants/validation";
import BaseFileInput from "../../Components/BASE/BaseFileInput";
import BaseRadioInput from "../../Components/BASE/BaseRadioInput";
import BaseSelectInput from "../../Components/BASE/BaseSelectInput";
import { toast } from "react-toastify";
import BaseLoader from "../../Components/BASE/BaseLoader";

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
  const [imageUploading, setImageUploading] = useState(false);
  const [countryLoading, setCountryLoading] = useState(false);
  const [stateLoading, setStateLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [userProfile, setUserProfile] = useState({
    id: "",
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

  const postalCodeValidation = validationField(CONSTANTS.PostalCode);
  const phoneValidation = validationField(CONSTANTS.phone_number);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: userProfile,
    validationSchema: Yup.object({
      phone: Yup.string().length(
        10,
        phoneValidation.fixLength(CONSTANTS.phone_number, 10)
      ),
      address_line2: Yup.string(),
      postal_code: Yup.string()
        .length(6, postalCodeValidation.fixLength(CONSTANTS.PostalCode, 6)),
     file: Yup.mixed()
        .nullable()
        .test("file", validationField(CONSTANTS.Image).imageSize, (file) => {
          if (!file) return true;
          return file.size <= 1024 * 1024;
        }),
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

        const res = await userApi.updateProfile(payload);
        toast.success(res?.data.message);
        setUserProfile({ ...formik.values });
        setAvatarPreview(imagePath);
        setIsEditing(false);
        setTimeout(() => {
          window.location.reload();
        }, 300);

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
      setCountryLoading(true);
      try {
        const res = await userApi.getCountries();
        setCountries(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setCountryLoading(false);
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
      setStateLoading(true);
      try {
        const res = await userApi.getStates(formik.values.country);
        setStates(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setStateLoading(false);
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
      setCityLoading(true);
      try {
        const res = await userApi.getCities(formik.values.state);
        setCities(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setCityLoading(false);
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
        id: profile.id,
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

    formik.setFieldValue("file", file);
    await formik.validateField("file");

    const errors = await formik.validateForm();
    const touched = { ...formik.touched, file: true };
    formik.setTouched(touched);

    if (errors.file) {
      return;
    }

    setImageUploading(true);
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
    } finally {
      setImageUploading(false);
    }
  };

  const handlePostalCodeChange = (e) => {
    const { value } = e.target;
    if (onlyNum.test(value)) {
      formik.handleChange(e);
    }
  };
  const handlePhoneNumberChange = (e) => {
    const { value } = e.target;
    if (onlyNum.test(value)) {
      formik.handleChange(e);
    }
  };

  document.title = "Profile";

  return (
    <div className="page-content w-100 min-vh-100">
      <Container fluid>
        <div className="d-flex justify-content-end gap-2 mx-3 mb-3">
          {isEditing ? null : (
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </BaseButton>
          )}
        </div>

        <Row>
          <Col lg="12">
            <Card className="position-relative">
              <CardBody>
                <div className="d-flex mb-0">
                  <div className="profile-user position-relative d-inline-block mx-auto mb-0 user-img">
                    <img
                      src={avatarPreview}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = avatar;
                      }}
                      className={`rounded-circle avatar-md img-thumbnail user-profile-image ${
                        imageUploading ? "loading" : ""
                      }`}
                      alt="user-avatar"
                    />
                    {imageUploading && (
                      <div className="profile-loader-overlay">
                        <BaseLoader size="15" />
                      </div>
                    )}

                    {isEditing && (
                      <>
                        <label htmlFor="avatar-upload" className="img-avatar">
                          <AiOutlineEdit className="text-size" />
                          <BaseFileInput
                            id="avatar-upload"
                            name="file"
                            value={formik.values.file}
                            type={CONSTANTS.file}
                            onChange={handleFileInputChange}
                            onBlur={formik.handleBlur}
                            isAvatarUpload={true}
                            onFileChange={onFileChange}
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
                      <p className="mb-1">Email Id: {userProfile.email}</p>
                      <p className="mb-0">Id No: {userProfile.id}</p>
                    </div>
                  </div>
                </div>
                {formik.touched.file && formik.errors.file ? (
                  <FormFeedback className="d-block mt-0">
                    {formik.errors.file}
                  </FormFeedback>
                ) : null}
              </CardBody>
            </Card>
          </Col>
        </Row>

     {!isEditing ? (

  <Card className="shadow-sm border-0">
    <CardBody>
      <h5 className="mb-4 fw-semibold text-primary">User Information</h5>
      <Row className="gy-3">
        <Col md={6}>
          <p className="mb-1 text-muted"><strong>Name:</strong></p>
          <p>{userProfile.first_name || "-"}</p>

          <p className="mb-1 text-muted"><strong>Phone:</strong></p>
          <p>{userProfile.phone || "-"}</p>

          <p className="mb-1 text-muted"><strong>Gender:</strong></p>
          <p>{userProfile.gender || "-"}</p>

          <p className="mb-1 text-muted"><strong>Country:</strong></p>
          <p>{countries.find(c => c.id === +userProfile.country)?.country_name || "-"}</p>

          <p className="mb-1 text-muted"><strong>State:</strong></p>
          <p>{states.find(s => s.id === +userProfile.state)?.state_name || "-"}</p>

          <p className="mb-1 text-muted"><strong>City:</strong></p>
          <p>{cities.find(ci => ci.id === +userProfile.city)?.city_name || "-"}</p>
        </Col>

        <Col md={6}>
          <p className="mb-1 text-muted"><strong>Role:</strong></p>
          <p>{role || "-"}</p>

          <p className="mb-1 text-muted"><strong>Email:</strong></p>
          <p>{userProfile.email || "-"}</p>

          <p className="mb-1 text-muted"><strong>Postal Code:</strong></p>
          <p>{userProfile.postal_code || "-"}</p>

          <p className="mb-1 text-muted"><strong>Address Line 1:</strong></p>
          <p>{userProfile.address_line1 || "-"}</p>

          <p className="mb-1 text-muted"><strong>Address Line 2:</strong></p>
          <p>{userProfile.address_line2 || "-"}</p>
        </Col>
      </Row>
    </CardBody>
  </Card>


) : (
  <Card>
    <CardBody>
      <Form onSubmit={formik.handleSubmit}>
        <Row>
                <Col md={6} className="mb-3">
                  <BaseInput
                    id={CONSTANTS.first_name}
                    name={CONSTANTS.first_name}
                    label={CONSTANTS.userName}
                    type={CONSTANTS.text}
                    onChange={formik.handleChange}
                    placeholder={inputField(CONSTANTS.firstName)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    value={formik.values.first_name}
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <FormFeedback className="d-block">
                      {formik.errors.first_name}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6} className="mb-3">
                  <BaseInput
                    id={CONSTANTS.phone}
                    name={CONSTANTS.phone}
                    label={CONSTANTS.phone_number}
                    type={CONSTANTS.text}
                    onChange={handlePhoneNumberChange}
                    placeholder={inputField(CONSTANTS.phone_number)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <FormFeedback className="d-block">
                      {formik.errors.phone}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6} className="mb-3">
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
                  />
                  {formik.touched.gender && formik.errors.gender ? (
                    <FormFeedback className="d-block">
                      {formik.errors.gender}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={6} className="mb-3">
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

                <Col md={4} className="mb-3">
                  <BaseSelectInput
                    id={CONSTANTS.country}
                    name={CONSTANTS.country}
                    label={CONSTANTS.Country}
                    value={formik.values.country}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={
                      countryLoading
                        ? [{ label: <BaseLoader />, value: "" }]
                        : [
                            {
                              label: selectLabel(CONSTANTS.Country),
                              value: "",
                            },
                            ...countries.map((c) => ({
                              label: c.country_name,
                              value: c.id,
                            })),
                          ]
                    }
                    disabled={!isEditing}
                  />
                  {formik.touched.country && formik.errors.country ? (
                    <FormFeedback className="d-block">
                      {formik.errors.country}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={4} className="mb-3">
                  <BaseSelectInput
                    id={CONSTANTS.state}
                    name={CONSTANTS.state}
                    value={formik.values.state}
                    label={CONSTANTS.state}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={
                      stateLoading
                        ? [{ label: <BaseLoader />, value: "" }]
                        : [
                            { label: selectLabel(CONSTANTS.State), value: "" },
                            ...states.map((s) => ({
                              label: s.state_name,
                              value: s.id,
                            })),
                          ]
                    }
                    disabled={!isEditing}
                  />
                  {formik.touched.state && formik.errors.state ? (
                    <FormFeedback className="d-block">
                      {formik.errors.state}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={4} className="mb-3">
                  <BaseSelectInput
                    id={CONSTANTS.city}
                    name={CONSTANTS.city}
                    value={formik.values.city}
                    label={CONSTANTS.City}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    options={
                      cityLoading
                        ? [{ label: <BaseLoader />, value: "" }]
                        : [
                            { label: selectLabel(CONSTANTS.City), value: "" },
                            ...cities.map((ci) => ({
                              label: ci.city_name,
                              value: ci.id,
                            })),
                          ]
                    }
                    formik={formik}
                    disabled={!isEditing}
                  />
                  {formik.touched.city && formik.errors.city ? (
                    <FormFeedback className="d-block">
                      {formik.errors.city}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={12} className="mb-3">
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
                  />
                  {formik.touched.address_line1 &&
                  formik.errors.address_line1 ? (
                    <FormFeedback className="d-block">
                      {formik.errors.address_line1}
                    </FormFeedback>
                  ) : null}
                </Col>

                <Col md={12} className="mb-3">
                  <BaseInput
                    id={CONSTANTS.address_line2}
                    name={CONSTANTS.address_line2}
                    label={CONSTANTS.addressLabel2}
                    value={formik.values.address_line2}
                    onChange={formik.handleChange}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.address_line2)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
                  />
                </Col>

                <Col md={6} className="mb-3">
                  <BaseInput
                    id={CONSTANTS.postal_code}
                    name={CONSTANTS.postal_code}
                    label={CONSTANTS.Postal_code}
                    value={formik.values.postal_code}
                    onChange={handlePostalCodeChange}
                    type={CONSTANTS.text}
                    placeholder={inputField(CONSTANTS.Postal_code)}
                    disabled={!isEditing}
                    onBlur={formik.handleBlur}
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
        )}
        <div className="d-flex justify-content-start gap-2 m-3">
          {isEditing ? (
            <>
              <BaseButton
                color="success"
                size="sm"
                type={CONSTANTS.submit}
                onClick={formik.handleSubmit}
                loading={saveLoading}
                disabled={!!error}
                className="fix-button"
              >
                {!saveLoading ? "Update" : null}
              </BaseButton>
              <BaseButton
                type="button"
                color="secondary"
                size="sm"
                className="fix-button"
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
