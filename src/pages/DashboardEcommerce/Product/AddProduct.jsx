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

      const res =  await authService.addProduct(payload);
        alert("Product added successfully");
        console.log("res", res);
      
      } catch (err) {
        console.error("Add Product Error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container fluid className="page-content mt-lg-5 w-100">
      <Card mt={5}>
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
                                name="product_title_name"
                                label="Variant Title"
                                formik={formik}
                                onChange={formik.handleChange}
                              />
                            </Col>
                            <Col md={6}>
                              <BaseInput
                                type="text"
                                name="description"
                                label="Description"
                                formik={formik}
                                onChange={formik.handleChange}
                              />
                            </Col>
                            <Col md={4}>
                              <BaseInput
                                type="text"
                                onChange={formik.handleChange}
                                label="Color"
                                name="color"
                                formik={formik}
                              />
                            </Col>
                            <Col md={4}>
                              <BaseInput
                                type="text"
                                label="Size"
                                name="size"
                                formik={formik}
                                onChange={formik.handleChange}
                              />
                            </Col>
                            <Col md={2}>
                              <BaseInput
                                label="Price"
                                type="number"
                                name="price"
                                formik={formik}
                                onChange={formik.handleChange}
                              />
                            </Col>
                            <Col md={2}>
                              <BaseInput
                                label="Qty"
                                name="quantity"
                                type="number"
                                formik={formik}
                                onChange={formik.handleChange}
                              />
                            </Col>
                            <Col md={6}>
                              <BaseInput
                                label="Variant Image"
                                name="variant_mage"
                                type="file"
                                onChange={formik.handleChange}
                                formik={formik}
                                onFileChange={(file) => {
                                  formik.setFieldValue(
                                    formik.product_variants.variant_image,
                                    file
                                  );
                                }}
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
