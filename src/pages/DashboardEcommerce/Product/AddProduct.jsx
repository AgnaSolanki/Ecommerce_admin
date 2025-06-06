import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Form, Input } from "reactstrap";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseButton from "../../../Components/BASE/BaseButton";
import authService from "../../../api/apiServices";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const res = await authService.getCategories();
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

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
      name: Yup.string().required("Product name is required"),
      category_id: Yup.string().required("Category is required"),
      product_variants: Yup.array().of(
        Yup.object().shape({
          product_title_name: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          color: Yup.string().required("Color is required"),
          size: Yup.string().required("Size is required"),
          price: Yup.number().required("Price is required"),
          quantity: Yup.number().required("Quantity is required"),
        })
      ),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const payload = { ...values };

        for (let i = 0; i < values.product_variants.length; i++) {
          const imageFile = values.product_variants[i].variant_image;
          if (imageFile) {
            const res = await authService.fileUpload(imageFile);
            payload.product_variants[i].variant_image = {
              image_path: res.data?.file_path || "",
            };
          }
        }

        await authService.addProduct(payload);
        alert("Product added successfully");
      } catch (err) {
        console.error("Add Product Error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container fluid className="page-content mt-lg-5 w-100">
      <Card mt-5>
        <CardBody>
          <FormikProvider value={formik}>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <BaseInput name="name" label="Product Name" formik={formik} />
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
                render={({ push, remove }) => (
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
                                name={`product_variants[${index}].price`}
                                label="Price"
                                type="number"
                                formik={formik}
                              />
                            </Col>
                            <Col md={2}>
                              <BaseInput
                                name={`product_variants[${index}].quantity`}
                                label="Qty"
                                type="number"
                                formik={formik}
                              />
                            </Col>
                            <Col md={6}>
                              <BaseInput
                                name={`product_variants[${index}].variant_image`}
                                label="Variant Image"
                                type="file"
                                formik={formik}
                                onFileChange={(file) => {
                                  formik.setFieldValue(
                                    `product_variants[${index}].variant_image`,
                                    file
                                  );
                                }}
                                isAvatarUpload={true}
                              />
                            </Col>
                            <Col md={12} className="text-end">
                              {index > 0 && (
                                <BaseButton
                                  color="danger"
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  Remove Variant
                                </BaseButton>
                              )}
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    ))}
                    <BaseButton
                      type="button"
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
                    >
                      + Add Variant
                    </BaseButton>
                  </>
                )}
              />

              <div className="text-end mt-3">
                <BaseButton type="submit" loading={loading}>
                  Submit Product
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
