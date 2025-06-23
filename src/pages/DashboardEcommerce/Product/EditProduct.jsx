import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormFeedback,
} from "reactstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseButton from "../../../Components/BASE/BaseButton";
import { useNavigate, useParams } from "react-router-dom";
import {
  isNumber,
  onlyNum,
  selectLabel,
  validationField,
} from "../../../Components/constants/validation";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import { toast } from "react-toastify";
import { CONSTANTS } from "../../../Components/constants/common";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import BaseFileInput from "../../../Components/BASE/BaseFileInput";
import userApi from "../../../api/userApi";
import BaseLoader from "../../../Components/BASE/BaseLoader";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRefs = useRef([]);

  const [categories, setCategories] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    name: "",
    category_id: "",
    id: "",
    product_variants: [],
  });

  const imageValidation = validationField(CONSTANTS.Image);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await userApi.viewProduct(id);
      const product = res.data?.data;

      if (product && Array.isArray(product.variants)) {
        const mappedVariants = product.variants.map((v) => ({
          product_title_name: v.product_title_name || "",
          description: v.description || "",
          color: v.color || "",
          size: v.size || "",
          price: String(v.price || ""),
          quantity: String(v.quantity || ""),
          variant_image: v.image?.image_path || "",
        }));

        const newValues = {
          name: product.name || "",
          category_id: product.category?.id ? String(product.category.id) : "",
          id: String(product.id || ""),
          product_variants: mappedVariants,
        };

        setInitialValues(newValues);
        formik.setValues(newValues);

        const previews = {};
        product.variants.forEach((v, idx) => {
          if (v.image?.image_path) {
            previews[`variant_image_preview_${idx}`] = ` ${
              import.meta.env.VITE_BASE_IMAGE
            }${v.image.image_path}`;
          }
        });
        setImagePreviews(previews);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await userApi.getCategories();
      setCategories(res.data?.data || []);
    } catch (err) {
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const productValidation = validationField(CONSTANTS.Product);
  const categoryValidation = validationField(CONSTANTS.Category);
  const titleValidation = validationField(CONSTANTS.Title);
  const descriptionValidation = validationField(CONSTANTS.Description);
  const colorValidation = validationField(CONSTANTS.Color);
  const sizeValidation = validationField(CONSTANTS.Size);
  const priceValidation = validationField(CONSTANTS.Price);
  const quantityValidation = validationField(CONSTANTS.Quantity);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required(productValidation.required),
      category_id: Yup.string().required(categoryValidation.required),
      product_variants: Yup.array().of(
        Yup.object().shape({
          product_title_name: Yup.string().required(titleValidation.required),
          description: Yup.string().required(descriptionValidation.required),
          color: Yup.string().required(colorValidation.required),
          size: Yup.string().required(sizeValidation.required),
          price: Yup.string()
            .required(priceValidation.required)
            .test(
              "is-num",
              isNumber(CONSTANTS.Price),
              (val) => !isNaN(Number(val))
            ),
          quantity: Yup.string()
            .required(quantityValidation.required)
            .test(
              "is-num",
              isNumber(CONSTANTS.Quantity),
              (val) => !isNaN(Number(val))
            ),
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
        delete payload.id;
        payload.category_id = Number(payload.category_id);

        for (let i = 0; i < payload.product_variants.length; i++) {
          payload.product_variants[i].price = Number(
            payload.product_variants[i].price
          );
          payload.product_variants[i].quantity = Number(
            payload.product_variants[i].quantity
          );

          const imageFile = values.product_variants[i].variant_image;

          if (imageFile instanceof File) {
            const res = await userApi.fileUpload(imageFile);
            const filePath = Array.isArray(res.data?.data)
              ? res.data.data[0]
              : res.data?.data;

            if (!filePath) {
              setSaveLoading(false);
              return;
            }

            payload.product_variants[i].variant_image = {
              image_path: filePath,
            };
          } else if (typeof imageFile === "string" && imageFile !== "") {
            payload.product_variants[i].variant_image = {
              image_path: imageFile,
            };
          } else {
            delete payload.product_variants[i].variant_image;
          }
        }

        const res = await userApi.editProduct(id, payload);
        toast.success(res?.data?.message);
        navigate(LoginRoutes.PRODUCT_LIST);
      } catch (err) {
        toast.error(err?.message);
      } finally {
        setSaveLoading(false);
      }
    },
  });
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

  const handleOtpChange = (e) => {
    const { value } = e.target;
    if (onlyNum.test(value)) {
      formik.handleChange(e);
    }
  };

  const handleCancel = () => {
    setCancelLoading(true);
    setTimeout(() => {
      setCancelLoading(false);
      navigate(LoginRoutes.PRODUCT_LIST);
    }, 500);
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
    <Container fluid className="page-content mt-lg-5 mb-4 w-100 mb-0">
      <Card className="p-4">
        <CardBody>
          {loading ? (
            <div className="text-center">
              <BaseLoader size={20} />
            </div>
          ) : (
            <FormikProvider value={formik}>
              <Form onSubmit={formik.handleSubmit}>
                <h4 className="mb-4">Edit Product</h4>
                <Row className="mb-3">
                  <Col md={6}>
                    <BaseInput
                      name="name"
                      value={formik.values.name}
                      label="Product Name"
                      onBlur={formik.handleBlur}
                      required={true}
                      onChange={formik.handleChange}
                      invalid={formik.touched.name && !!formik.errors.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <FormFeedback className="d-block">
                        {formik.errors.name}
                      </FormFeedback>
                    )}
                  </Col>
                  <Col md={6}>
                    <BaseSelectInput
                      name="category_id"
                      label={CONSTANTS.Category}
                      type={CONSTANTS.select}
                      value={formik.values.category_id}
                      options={[
                        { label: selectLabel(CONSTANTS.Category), value: "" },
                        ...categories.map((cat) => ({
                          label: cat.category_name,
                          value: String(cat.id),
                        })),
                      ]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      required={true}
                      invalid={
                        formik.touched.category_id &&
                        !!formik.errors.category_id
                      }
                    />
                    {formik.touched.category_id &&
                      formik.errors.category_id && (
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
                            <Row className="g-3">
                              <Col md={6}>
                                <BaseInput
                                  type={CONSTANTS.text}
                                  name={`product_variants[${index}].product_title_name`}
                                  value={variant.product_title_name}
                                  label={CONSTANTS.VariantTitle}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.product_title_name &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.product_title_name
                                  }
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
                                  value={variant.description}
                                  label={CONSTANTS.Description}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.description &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.description
                                  }
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
                                  value={variant.color}
                                  label={CONSTANTS.Color}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.color &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.color
                                  }
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
                                  value={variant.size}
                                  label={CONSTANTS.Size}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.size &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.size
                                  }
                                />
                                {formik.touched.product_variants?.[index]
                                  ?.size &&
                                  formik.errors.product_variants?.[index]
                                    ?.size && (
                                    <FormFeedback className="d-block">
                                      {
                                        formik.errors.product_variants[index]
                                          .size
                                      }
                                    </FormFeedback>
                                  )}
                              </Col>

                              <Col md={3}>
                                <BaseInput
                                  label={CONSTANTS.Price}
                                  type={CONSTANTS.text}
                                  name={`product_variants[${index}].price`}
                                  value={variant.price}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  onChange={handleOtpChange}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.price &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.price
                                  }
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
                                  name={`product_variants[${index}].quantity`}
                                  value={variant.quantity}
                                  type={CONSTANTS.text}
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  onChange={handleOtpChange}
                                  invalid={
                                    formik.touched.product_variants?.[index]
                                      ?.quantity &&
                                    !!formik.errors.product_variants?.[index]
                                      ?.quantity
                                  }
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
                                  name={`product_variants[${index}].variant_image`}
                                  type={CONSTANTS.file}
                                  label={CONSTANTS.Image}
                                  isAvatarUpload={false}
                                  onChange={(e) =>
                                    handleFileChange(e.target.files[0], index)
                                  }
                                  onBlur={formik.handleBlur}
                                  required={true}
                                  inputRef={(el) =>
                                    (fileInputRefs.current[index] = el)
                                  }
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

                <Row className="mt-4">
                  <Col>
                    <BaseButton
                      type={CONSTANTS.submit}
                      loading={saveLoading}
                      color="primary"
                      className="fix-button"
                    >
                      {!saveLoading ? "Submit" : null}
                    </BaseButton>
                    <BaseButton
                      type={CONSTANTS.Button}
                      loading={cancelLoading}
                      color="secondary"
                      className="ms-3 fix-button"
                      onClick={handleCancel}
                    >
                      {!cancelLoading ? "Cancel" : null}
                    </BaseButton>
                  </Col>
                </Row>
              </Form>
            </FormikProvider>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditProduct;
