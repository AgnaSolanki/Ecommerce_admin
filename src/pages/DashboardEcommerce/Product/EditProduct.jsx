import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form } from "reactstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseButton from "../../../Components/BASE/BaseButton";
import userApi from "../../../api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import {
  onlyNum,
  validationField,
} from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";
import { LoginRoutes } from "../../../Routes/apiRoutes";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await userApi.getCategories();
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await userApi.viewProduct(id);
        const product = res.data?.data;

        if (product) {
          formik.setValues({
            name: product.name || "",
            category_id: String(product.category_id || ""),
            product_variants: product.product_variants.map((v) => ({
              product_title_name: v.product_title_name || "",
              description: v.description || "",
              color: v.color || "",
              size: v.size || "",
              price: String(v.price || ""),
              quantity: String(v.quantity || ""),
              variant_image: v.variant_image?.image_path || null,
            })),
          });

          // Initialize image previews
          const previews = {};
          product.product_variants.forEach((v, idx) => {
            if (v.variant_image?.image_path) {
              previews[`variant_image_preview_${idx}`] = v.variant_image.image_path;
            }
          });
          setImagePreviews(previews);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    fetchCategories();
    fetchProduct();
  }, [id]);


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
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      category_id: Yup.string()
        .required("Category is required")
        .test(
          "is-num",
          "Category must be a number",
          (val) => !isNaN(Number(val))
        ),
      product_variants: Yup.array().of(
        Yup.object().shape({
          product_title_name: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          color: Yup.string().required("Color is required"),
          size: Yup.string().required("Size is required"),
          price: Yup.string()
            .required("Price is required")
            .test(
              "is-num",
              "Price must be a number",
              (val) => !isNaN(Number(val))
            ),
          quantity: Yup.string()
            .required("Quantity is required")
            .test(
              "is-num",
              "Quantity must be a number",
              (val) => !isNaN(Number(val))
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
          } else if (typeof imageFile === "string") {
            payload.product_variants[i].variant_image = {
              image_path: imageFile,
            };
          } else {
            payload.product_variants[i].variant_image = null;
          }
        }

        await userApi.editProduct(id, payload);
        navigate(LoginRoutes.PRODUCT_LIST);
      } catch (err) {
        console.error("Edit Product Error:", err);
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
      <Card>
        <CardBody>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <BaseInput
                    name="name"
                    label="Product Name"
                    formik={formik}
                    onChange={formik.handleChange}
                  />
                </Col>
                <Col md={6}>
                  <BaseInput
                    name="category_id"
                    label="Category"
                    type="select"
                    options={[
                      { label: "Select Category", value: "" },
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
                name="product_variants"
                render={() => (
                  <>
                    {formik.values.product_variants.map((variant, index) => (
                      <Card key={index} className="my-3">
                        <CardBody>
                          <Row>
                            <Col md={6}>
                              <BaseInput
                                type="text"
                                name={`product_variants[${index}].product_title_name`}
                                label="Variant Title"
                                formik={formik}
                              />
                            </Col>
                            <Col md={6}>
                              <BaseInput
                                type="text"
                                name={`product_variants[${index}].description`}
                                label="Description"
                                formik={formik}
                              />
                            </Col>
                            <Col md={4}>
                              <BaseInput
                                type="text"
                                name={`product_variants[${index}].color`}
                                label="Color"
                                formik={formik}
                              />
                            </Col>
                            <Col md={4}>
                              <BaseInput
                                type="text"
                                name={`product_variants[${index}].size`}
                                label="Size"
                                formik={formik}
                              />
                            </Col>
                            <Col md={2}>
                              <BaseInput
                                label="Price"
                                type="text"
                                name={`product_variants[${index}].price`}
                                formik={formik}
                                onChange={handleOtpChange}
                              />
                            </Col>
                            <Col md={2}>
                              <BaseInput
                                label="Qty"
                                name={`product_variants[${index}].quantity`}
                                type="text"
                                formik={formik}
                                onChange={handleOtpChange}
                              />
                            </Col>
                            <Col md={6}>
                              <BaseInput
                                name={`product_variants[${index}].variant_image`}
                                type="file"
                                isAvatarUpload={false}
                                formik={formik}
                                onFileChange={(file) => {
                                  const fileUrl = URL.createObjectURL(file);
                                  formik.setFieldValue(
                                    `product_variants[${index}].variant_image`,
                                    file
                                  );
                                  const previewKey = `variant_image_preview_${index}`;
                                  setImagePreviews((prev) => ({
                                    ...prev,
                                    [previewKey]: fileUrl,
                                  }));
                                }}
                              />

                              <img
                                src={
                                  imagePreviews[`variant_image_preview_${index}`] ||
                                  (typeof variant.variant_image === "string"
                                    ? variant.variant_image
                                    : "")
                                }
                                className="rounded avatar-md img-thumbnail"
                                alt="variant preview"
                              />
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ))}
                  </>
                )}
              />

              <div className="text-end mt-3">
                <BaseButton
                  color="success"
                  size="sm"
                  type={CONSTANTS.submit}
                  onClick={formik.handleSubmit}
                  loading={saveLoading}
                >
                  {!saveLoading ? "Update Product" : null}
                </BaseButton>
                <BaseButton
                  type="button"
                  color="secondary"
                  size="sm"
                  onClick={handleCancel}
                  loading={cancelLoading}
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

export default EditProduct;
