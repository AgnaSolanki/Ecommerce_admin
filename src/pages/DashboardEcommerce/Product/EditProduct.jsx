import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseButton from "../../../Components/BASE/BaseButton";
import { useNavigate, useParams } from "react-router-dom";
import { isNumber, onlyNum, selectLabel, validationField } from "../../../Components/constants/validation";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import { toast } from "react-toastify";
import { CONSTANTS } from "../../../Components/constants/common";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import BaseFileInput from "../../../Components/BASE/BaseFileInput";
import userApi from "../../../api/userApi";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});
  const [initialValues, setInitialValues] = useState({
    name: "",
    category_id: "",
    id: "",
    product_variants: [
      {
        product_title_name: "",
        description: "",
        color: "",
        size: "",
        price: "",
        quantity: "",
        variant_image: "",
      },
    ],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await userApi.getCategories();
        setCategories(res.data?.data || []);
      } catch (err) {
       toast.error(err?.message);
      }
    };

    const fetchProduct = async () => {
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

          setInitialValues({
            name: product.name || "",
            category_id: product.category?.id || "",
            id: String(product.id || ""),
            product_variants: mappedVariants,
          });

          const previews = {};
          product.variants.forEach((v, idx) => {
            if (v.image?.image_path) {
              previews[`variant_image_preview_${idx}`] = `${
                import.meta.env.VITE_BASE_IMAGE
              }/${v.image.image_path}`;
            }
          });
          setImagePreviews(previews);
        }
      } catch (error) {
        toast.error(error?.message);
      }
    };

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
    initialValues: initialValues,
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
            const formData = new FormData();
            formData.append("files", imageFile);
            const res = await userApi.fileUpload(formData);
            const filePath = res.data?.data?.[0];
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

        await userApi.editProduct(id, payload);

        navigate(LoginRoutes.PRODUCT_LIST);
      } catch (err) {
        toast.error(err?.message);
      } finally {
        setSaveLoading(false);
      }
    },
  });

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

  return (
    <Container fluid className="page-content mt-lg-5 w-100">
      <Card className="p-4">
        <CardBody>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <h4 className="mb-4">Edit Product</h4>
              <Row className="mb-3">
                <Col md={6}>
                  <BaseInput
                    name="name"
                    label="Product Name"
                    formik={formik}
                    onChange={formik.handleChange}
                  />
                </Col>
                <Col md={6}>
                  <BaseSelectInput
                    name={CONSTANTS.category_id}
                    label={CONSTANTS.Category}
                    type={CONSTANTS.select}
                    options={[
                      { label: selectLabel(CONSTANTS.Category), value: "" },
                      ...categories.map((cat) => ({
                        label: cat.category_name,
                        value: cat.id,
                      })),
                    ]}
                    formik={formik}
                  />
                </Col>
              </Row>

              <FieldArray
                name={CONSTANTS.product_variants}
                render={() => (
                  <>
                    {formik.values.product_variants.map((variant, index) => (
                      <Card key={index} className="my-4 shadow-sm p-3">
                        <h5 className="mb-3">Variant {index + 1}</h5>
                        <Row className="g-3">
                          <Col md={6}>
                            <BaseInput
                              type={CONSTANTS.text}
                              name={`product_variants[${index}].product_title_name`}
                              label={CONSTANTS.VariantTitle}
                              formik={formik}
                            />
                          </Col>
                          <Col md={6}>
                            <BaseInput
                              type={CONSTANTS.text}
                              name={`product_variants[${index}].description`}
                              label={CONSTANTS.Description}
                              formik={formik}
                            />
                          </Col>
                          <Col md={4}>
                            <BaseInput
                              type={CONSTANTS.text}
                              name={`product_variants[${index}].color`}
                              label={CONSTANTS.Color}
                              formik={formik}
                            />
                          </Col>
                          <Col md={4}>
                            <BaseInput
                              type={CONSTANTS.text}
                              name={`product_variants[${index}].size`}
                              label={CONSTANTS.Size}
                              formik={formik}
                            />
                          </Col>
                          <Col md={2}>
                            <BaseInput
                              label={CONSTANTS.Price}
                              type={CONSTANTS.text}
                              name={`product_variants[${index}].price`}
                              formik={formik}
                              onChange={handleOtpChange}
                            />
                          </Col>
                          <Col md={2}>
                            <BaseInput
                              label={CONSTANTS.Qty}
                              name={`product_variants[${index}].quantity`}
                              type={CONSTANTS.text}
                              formik={formik}
                              onChange={handleOtpChange}
                            />
                          </Col>
                          <Col md={6}>
                            <BaseFileInput
                              name={`product_variants[${index}].variant_image`}
                              type={CONSTANTS.file}
                              isAvatarUpload={false}
                              formik={formik}
                                onFileChange={async (file) => {
                                if (file) {
                                  try {
                                    const uploadRes = await userApi.fileUpload(
                                      file
                                    );
                                    const fileData = uploadRes.data?.data;
                                    const fileName = Array.isArray(fileData)
                                      ? fileData[0]
                                      : fileData;

                                    if (fileName) {
                                      formik.setFieldValue(
                                        `product_variants[${index}].variant_image`,
                                        fileName
                                      );
                                      const imageURL = `${
                                        import.meta.env.VITE_BASE_IMAGE
                                      }${fileName}`;
                                      const previewKey = `variant_image_preview_${index}`;
                                      setImagePreviews((prev) => ({
                                        ...prev,
                                        [previewKey]: imageURL,
                                      }));
                                    } else {
                                      toast.error("Failed to upload image.");
                                    }
                                  } catch (err) {
                                    toast.error(
                                      err.message || "Image upload failed."
                                    );
                                  }
                                }
                              }}
                            />
                            <div className="mt-2">
                              <img
                                src={
                                  imagePreviews[
                                    `variant_image_preview_${index}`
                                  ] || avatar
                                }
                                alt="Variant Preview"
                                height="80"
                              />
                            </div>
                          </Col>
                        </Row>
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
                  >
                    Save
                  </BaseButton>
                  <BaseButton
                    type={CONSTANTS.Button}
                    loading={cancelLoading}
                    color="secondary"
                    className="ms-3"
                    onClick={handleCancel}
                  >
                    Cancel
                  </BaseButton>
                </Col>
              </Row>
            </Form>
          </FormikProvider>
        </CardBody>
      </Card>
    </Container>
  );
};

export default EditProduct;
