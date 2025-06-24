import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  CardHeader,
  FormFeedback,
} from "reactstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import { useNavigate } from "react-router-dom";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import {
  onlyNum,
  selectLabel,
  validationField,
} from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import { toast } from "react-toastify";
import BaseFileInput from "../../../Components/BASE/BaseFileInput";
import userApi from "../../../api/userApi";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
  const fileInputRefs = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await userApi.getCategories();
        setCategories(res.data?.data || []);
      } catch (err) {
        toast.error(err?.message);
      }
    };
    fetchCategories();
  }, []);

  const productNameValidation = validationField(CONSTANTS.ProductName);
  const categoryValidation = validationField(CONSTANTS.Category);
  const variantTitleValidation = validationField(CONSTANTS.variantTitle);
  const descriptionValidation = validationField(CONSTANTS.Description);
  const colorValidation = validationField(CONSTANTS.Color);
  const sizeValidation = validationField(CONSTANTS.Size);
  const priceValidation = validationField(CONSTANTS.Price);
  const quantityValidation = validationField(CONSTANTS.Quantity);
  const imageValidation = validationField(CONSTANTS.Image);

  const formik = useFormik({
    initialValues: {
      name: "",
      category_id: "",
      product_variants: [
        {
          product_title_name: "",
          description: "",
          color: "",
          size: "",
          price: "",
          quantity: "",
          variant_image: null,
        },
      ],
    },
    validationSchema: Yup.object({
      name: Yup.string().required(productNameValidation.required),
      category_id: Yup.string().required(categoryValidation.required),
      product_variants: Yup.array().of(
        Yup.object().shape({
          product_title_name: Yup.string().required(
            variantTitleValidation.required
          ),
          description: Yup.string().required(descriptionValidation.required),
          color: Yup.string().required(colorValidation.required),
          size: Yup.string().required(sizeValidation.required),
          price: Yup.string().required(priceValidation.required),
          quantity: Yup.string().required(quantityValidation.required),
          variant_image: Yup.mixed()
            .nullable()
            .test("required-image", imageValidation.required, (value) => {
              if (typeof value === "string" || value) return true;
              return false;
            })
            .test(
              "fileSize",
              validationField(CONSTANTS.Image).imageSize,
              (value) => {
                if (!value) return true;
                if (typeof value === "string") return true;
                return value.size <= 1024 * 1024;
              }
            ),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        setSaveLoading(true);
        const payload = JSON.parse(JSON.stringify(values));
        payload.category_id = Number(payload.category_id);
        payload.product_variants = payload.product_variants.map((v) => ({
          ...v,
          price: Number(v.price),
          quantity: Number(v.quantity),
        }));

        for (let i = 0; i < values.product_variants.length; i++) {
          const imageFile = values.product_variants[i].variant_image;

          if (imageFile instanceof File) {
            const res = await userApi.fileUpload(imageFile);
            const filePath = Array.isArray(res.data?.data)
              ? res.data.data[0]
              : res.data?.data;
            toast.success(res?.data?.message);

            if (!filePath) {
              setSaveLoading(false);
              return;
            }

            payload.product_variants[i].variant_image = {
              image_path: filePath,
            };
          } else if (typeof imageFile === "string") {
            payload.product_variants[i].variant_image = {
              image_path: imageFile,
            };
          }
        }

        const res = await userApi.addProduct(payload);
        toast.success(res?.data?.message);

        navigate(LoginRoutes.PRODUCT_LIST);
      } catch (err) {
        toast.error(err?.message);
      } finally {
        setSaveLoading(false);
      }
    },
  });

  const handleNumChange = (e) => {
    const { name, value } = e.target;
    if (value === "" || onlyNum.test(value)) {
      formik.setFieldValue(name, value);
    }
  };

  const handleCancel = () => {
    setCancelLoading(true);
    setTimeout(() => {
      setCancelLoading(false);
      navigate(LoginRoutes.PRODUCT_LIST);
    }, 500);
  };

  const handleFileChange = async (file, index) => {
    if (!file) return;

    const variantSchema = Yup.object().shape({
      variant_image: Yup.mixed()
        .required(imageValidation.required)
        .test("fileSize", imageValidation.imageSize, (value) => {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 1024 * 1024;
        }),
    });

    try {
      await variantSchema.validate({ variant_image: file });

      const res = await userApi.fileUpload(file);
      const fileData = res.data?.data;
      const fileName = Array.isArray(fileData) ? fileData[0] : fileData;

      if (fileName) {
        const imageURL = `${import.meta.env.VITE_BASE_IMAGE}${fileName}`;

        setImagePreviews((prev) => ({
          ...prev,
          [`variant_image_preview_${index}`]: imageURL,
        }));

        formik.setFieldValue(
          `product_variants[${index}].variant_image`,
          fileName
        );
      }
    } catch (error) {
      toast.error(error?.message);
      formik.setFieldError(
        `product_variants[${index}].variant_image`,
        error?.message
      );
      formik.setFieldTouched(`product_variants[${index}].variant_image`, true);
    }
  };

  const isVariantFilled = (variant) => {
    return (
      variant.product_title_name &&
      variant.description &&
      variant.color &&
      variant.size &&
      variant.price &&
      variant.quantity &&
      variant.variant_image
    );
  };
  const handleRemoveImage = (index) => {
    formik.setFieldValue(`product_variants[${index}].variant_image`, null);

    setImagePreviews((prev) => {
      const updatedPreviews = { ...prev };
      delete updatedPreviews[`variant_image_preview_${index}`];
      return updatedPreviews;
    });

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }

    formik.setFieldTouched(`product_variants[${index}].variant_image`, true);
  };

  return (
    <Container fluid className="page-content mt-lg-2 mb-3 w-100">
      <Card>
        <CardHeader>
          <h4 className="mb-0">Add New Product</h4>
        </CardHeader>
        <CardBody>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <h5 className="mb-3">Basic Product Details</h5>
              <Row className="mb-4">
                <Col md={6} className="mb-3">
                  <BaseInput
                    name={CONSTANTS.name}
                    label={CONSTANTS.ProductName}
                    formik={formik}
                    onChange={formik.handleChange}
                    required={true}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <FormFeedback className="d-block">
                      {formik.errors.name}
                    </FormFeedback>
                  )}
                </Col>
                <Col md={6} className="mb-3">
                  <BaseSelectInput
                    name={CONSTANTS.category_id}
                    label={CONSTANTS.Category}
                    type={CONSTANTS.select}
                    onChange={formik.handleChange}
                    required={true}
                    options={[
                      { label: selectLabel(CONSTANTS.Category), value: "" },
                      ...categories.map((cat) => ({
                        label: cat.category_name,
                        value: cat.id,
                      })),
                    ]}
                    formik={formik}
                  />
                  {formik.touched.category_id && formik.errors.category_id && (
                    <FormFeedback className="d-block">
                      {formik.errors.category_id}
                    </FormFeedback>
                  )}
                </Col>
              </Row>

              <FieldArray
                name="product_variants"
                render={({ push, remove }) => (
                  <>
                    {formik.values.product_variants.map((variant, index) => (
                      <Card
                        key={index}
                        className="mb-4 border rounded shadow-sm"
                      >
                        <CardHeader className="bg-light d-flex justify-content-between align-items-center">
                          <h6 className="mb-0">Variant {index + 1}</h6>
                          {isVariantFilled(variant) &&
                          formik.values.product_variants.length > 1 ? (
                            <BaseButton
                              type="button"
                              size="sm"
                              color="danger"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </BaseButton>
                          ) : (
                            <BaseButton
                              type="button"
                              size="sm"
                              color="primary"
                              onClick={() =>
                                push({
                                  product_title_name: "",
                                  description: "",
                                  color: "",
                                  size: "",
                                  price: "",
                                  quantity: "",
                                  variant_image: null,
                                })
                              }
                              disabled={!isVariantFilled(variant)}
                            >
                              + Add Variant
                            </BaseButton>
                          )}
                        </CardHeader>

                        <CardBody>
                          <Row className="gy-3">
                            <Col md={6}>
                              <BaseInput
                                type={CONSTANTS.text}
                                name={`product_variants[${index}].product_title_name`}
                                label={CONSTANTS.VariantTitle}
                                formik={formik}
                                onChange={formik.handleChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.product_title_name &&
                                formik.errors.product_variants?.[index]
                                  ?.product_title_name && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .product_title_name
                                    }
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={6}>
                              <BaseInput
                                type={CONSTANTS.text}
                                name={`product_variants[${index}].description`}
                                label={CONSTANTS.Description}
                                formik={formik}
                                onChange={formik.handleChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.description &&
                                formik.errors.product_variants?.[index]
                                  ?.description && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .description
                                    }
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={3}>
                              <BaseInput
                                type={CONSTANTS.text}
                                name={`product_variants[${index}].color`}
                                label={CONSTANTS.Color}
                                formik={formik}
                                onChange={formik.handleChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.color &&
                                formik.errors.product_variants?.[index]
                                  ?.color && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .color
                                    }
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={3}>
                              <BaseInput
                                type={CONSTANTS.text}
                                name={`product_variants[${index}].size`}
                                label={CONSTANTS.Size}
                                formik={formik}
                                onChange={formik.handleChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]?.size &&
                                formik.errors.product_variants?.[index]
                                  ?.size && (
                                  <FormFeedback className="d-block">
                                    {formik.errors.product_variants[index].size}
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={3}>
                              <BaseInput
                                label={CONSTANTS.Price}
                                value={variant.price}
                                type={CONSTANTS.text}
                                name={`product_variants[${index}].price`}
                                onChange={handleNumChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.price &&
                                formik.errors.product_variants?.[index]
                                  ?.price && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .price
                                    }
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={3}>
                              <BaseInput
                                label={CONSTANTS.Qty}
                                value={variant.quantity}
                                name={`product_variants[${index}].quantity`}
                                type={CONSTANTS.text}
                                onChange={handleNumChange}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.quantity &&
                                formik.errors.product_variants?.[index]
                                  ?.quantity && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .quantity
                                    }
                                  </FormFeedback>
                                )}
                            </Col>

                            <Col md={4}>
                              <BaseFileInput
                                inputRef={(el) =>
                                  (fileInputRefs.current[index] = el)
                                }
                                name={`product_variants[${index}].variant_image`}
                                label={CONSTANTS.Image}
                                type={CONSTANTS.file}
                                isAvatarUpload={false}
                                onChange={(e) =>
                                  handleFileChange(e.target.files[0], index)
                                }
                                onBlur={formik.handleBlur}
                                required={true}
                              />
                              {formik.touched.product_variants?.[index]
                                ?.variant_image &&
                                formik.errors.product_variants?.[index]
                                  ?.variant_image && (
                                  <FormFeedback className="d-block">
                                    {
                                      formik.errors.product_variants[index]
                                        .variant_image
                                    }
                                  </FormFeedback>
                                )}

                              <div className="mt-3 text-center position-relative d-inline-block">
                                {imagePreviews[
                                  `variant_image_preview_${index}`
                                ] && (
                                  <div className="position-relative d-inline-block">
                                    <img
                                      src={
                                        imagePreviews[
                                          `variant_image_preview_${index}`
                                        ]
                                      }
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = avatar;
                                      }}
                                      className="rounded avatar-lg img-thumbnail variant_img"
                                      alt="variant preview"
                                    />
                                    <BaseButton
                                      type="button"
                                      color="danger"
                                      size="sm"
                                      className="position-absolute top-0 end-0 m-1 p-0 d-flex align-items-center justify-content-center img-close"
                                      onClick={() => handleRemoveImage(index)}
                                    >
                                      ✕
                                    </BaseButton>
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ))}
                  </>
                )}
              />

              <div className="text-start mt-4">
                <BaseButton
                  color="danger"
                  size="sm"
                  type={CONSTANTS.submit}
                  onClick={formik.handleSubmit}
                  loading={saveLoading}
                  className="me-2 fix-button"
                >
                  {!saveLoading ? "Submit" : null}
                </BaseButton>
                <BaseButton
                  type={CONSTANTS.button}
                  color="secondary"
                  size="sm"
                  onClick={handleCancel}
                  loading={cancelLoading}
                  className="fix-button"
                >
                  {!cancelLoading ? "Cancel" : null}
                </BaseButton>
              </div>
            </Form>
          </FormikProvider>
        </CardBody>
      </Card>
    </Container>
  );
};

export default AddProduct;
