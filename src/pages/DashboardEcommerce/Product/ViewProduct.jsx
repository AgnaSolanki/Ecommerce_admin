import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody} from "reactstrap";
import BaseButton from "../../../Components/BASE/BaseButton";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import apiService from "../../../api/authApi";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiService.viewProduct(id);
        setProduct(res.data?.data || null);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <Container fluid className="page-content mt-lg-5 w-100">
      <Card>
        <CardBody>
          <h3>Product Details</h3>
          <Row>
            <Col md={6}>
              <strong>Name:</strong> {product.name}
            </Col>
            <Col md={6}>
              <strong>Category ID:</strong> {product.category_id}
            </Col>
          </Row>

          <h4 className="mt-4">Product Variants</h4>
          {product.product_variants && product.product_variants.length > 0 ? (
            product.product_variants.map((variant, index) => (
              <Card key={index} className="my-3">
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <strong>Title:</strong> {variant.product_title_name}
                    </Col>
                    <Col md={6}>
                      <strong>Description:</strong> {variant.description}
                    </Col>
                    <Col md={4}>
                      <strong>Color:</strong> {variant.color}
                    </Col>
                    <Col md={4}>
                      <strong>Size:</strong> {variant.size}
                    </Col>
                    <Col md={2}>
                      <strong>Price:</strong> {variant.price}
                    </Col>
                    <Col md={2}>
                      <strong>Quantity:</strong> {variant.quantity}
                    </Col>
                    <Col md={6} className="mt-3">
                      {variant.variant_image?.image_path ? (
                        <img
                          src={variant.variant_image.image_path}
                          alt={`Variant ${index + 1}`}
                          className="rounded avatar-md img-thumbnail"
                        />
                      ) : (
                        <p>No Image</p>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            ))
          ) : (
            <p>No variants available.</p>
          )}

          <div className="text-end mt-3">
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => navigate(LoginRoutes.EDIT_PRODUCT)}
            >
              Edit Product
            </BaseButton>
            <BaseButton
              color="secondary"
              size="sm"
              className="ms-2"
              onClick={() => navigate(LoginRoutes.PRODUCT_LIST)}
            >
              Back to List
            </BaseButton>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ViewProduct;
