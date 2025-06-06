import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Table, Button } from "reactstrap";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import userApi from "../../../api/userApi";
import authService from "../../../api/apiServices";
import { CONSTANTS } from "../../../Components/constants/common";
import {
  postalCodeRegex,
  validationField,
} from "../../../Components/constants/validation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { LoginRoutes } from "../../../Routes/apiRoutes";

const ProductList = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(avatar);
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await authService.productList({}); // add pagination or filter if needed
      setProductList(response.data?.products || []); // adjust based on API response structure
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  // Fetch user info
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
    fetchProducts();
  }, []);

  // Formik Setup (unchanged)
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string().required(
        validationField(CONSTANTS.first_name).required
      ),
      country: Yup.string().required(
        validationField(CONSTANTS.country).required
      ),
      state: Yup.string().required(validationField(CONSTANTS.state).required),
      city: Yup.string().required(validationField(CONSTANTS.city).required),
      postal_code: Yup.string()
        .matches(
          postalCodeRegex,
          validationField(CONSTANTS.postalCode).minLength(
            CONSTANTS.postalCode,
            6
          )
        )
        .required(validationField(CONSTANTS.postalCode).required)
        .max(
          6,
          validationField(CONSTANTS.postalCode).maxLength(
            CONSTANTS.postalCode,
            6
          )
        ),
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
        setIsEditing(false);
        setError("");
      } catch (error) {
        console.error(error.message);
      } finally {
        setSaveLoading(false);
      }
    },
  });

  document.title = "Product";

  return (
    <div className="page-content mt-lg-5 w-100">
      <Container fluid>
        <div className="d-flex justify-content-end gap-2 m-3">
          {isEditing ? null : (
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => navigate(LoginRoutes.ADD_PRODUCT)}
            >
              Add Product
            </BaseButton>
          )}
        </div>
        <h4 className="mb-3">All Products</h4>

        {/* Product Table */}
        <Card className="mb-4">
          <CardBody>
            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.length > 0 ? (
                  productList.map((product, index) => {
                    const variant = product.product_variants?.[0] || {};
                    const image = variant.variant_image?.image_path || avatar;
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{product.name}</td>
                        <td>
                          <img
                            src={image}
                            alt={product.name}
                            style={{
                              width: 60,
                              height: 60,
                              objectFit: "cover",
                            }}
                            className="rounded"
                          />
                        </td>
                        <td>
                          <Button size="sm" color="primary" className="me-2">
                            View
                          </Button>
                          <Button size="sm" color="warning" className="me-2">
                            Edit
                          </Button>
                          <Button size="sm" color="danger">
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ProductList;
