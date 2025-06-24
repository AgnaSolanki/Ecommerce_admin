import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Badge,
  Spinner,
} from "reactstrap";
import BaseButton from "../../../Components/BASE/BaseButton";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import userApi from "../../../api/userApi";
import { IoMdArrowRoundBack } from "react-icons/io";

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await userApi.viewProduct(id);
        setProduct(res.data?.data || null);
      } catch (error) {
        toast.error(error?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4>Product not found.</h4>
      </div>
    );
  }

  return (
    <Container fluid className="page-content">
      <div className="d-flex justify-content-end mb-3">
        <BaseButton
          size="md"
          color="danger"
          className="d-flex align-items-center gap-1"
          onClick={() => navigate(LoginRoutes.PRODUCT_LIST)}
        >
          <IoMdArrowRoundBack size={18} />
        </BaseButton>
      </div>

      <Card className="shadow-sm p-4 bg-light mb-4">
        <h4 className="mb-3 fw-bold">Basic Information</h4>
        <Row className="gy-2">
          <Col xs={12} md={4}>
            <span className="fw-semibold me-2">Product ID:</span>
            <Badge color="primary" pill>
              {product.id}
            </Badge>
          </Col>
          <Col xs={12} md={4}>
            <span className="fw-semibold me-2">Product Name:</span>
            {product.name}
          </Col>
          <Col xs={12} md={4}>
            <span className="fw-semibold me-2">Category:</span>
            <Badge color="info" pill className="me-1">
              {product.category?.category_name}
            </Badge>
            <small className="text-muted">
              (ID: {product.category?.id || "N/A"})
            </small>
          </Col>
        </Row>
      </Card>

      <h4 className="mb-3 fw-bold">Product Variants</h4>
      {product.variants && product.variants.length > 0 ? (
        product.variants.map((variant, index) => (
          <Card key={index} className="mb-4 p-3 border-0 shadow-sm">
            <CardBody>
             <Row className="gy-4 flex-column flex-md-row align-items-start">

                <Col
                  xs={12}
                  md={2}
                  className="d-flex justify-content-center align-items-center mb-3 mb-md-0"
                >
                  <img
                    src={
                      variant.image?.image_path
                        ? `${import.meta.env.VITE_BASE_IMAGE}/${variant.image.image_path}`
                        : avatar
                    }
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = avatar;
                    }}
                    alt="Variant"
                    className="rounded border img-fluid variant-image"
                  />
                </Col>

                <Col xs={12} md={10} className="ps-4">
                  <h5 className="fw-bold mb-2">{variant.product_title_name}</h5>

                  <p className="mb-2 d-flex flex-wrap align-items-center">
                    <span className="text-success fw-bold me-3">
                      Price: ₹{variant.price}
                    </span>
                    <span className="fw-semibold me-2">Color:</span>
                    {variant.color}
                  </p>

                  <p className="mb-2">{variant.description}</p>

                  <Row className="gy-2">
                    <Col xs={12} sm={4} md={2}>
                      <span className="fw-semibold me-1">ID:</span>
                      <Badge color="primary" pill>
                        {variant.id}
                      </Badge>
                    </Col>
                    <Col xs={12} sm={4} md={2}>
                      <span className="fw-semibold me-1">Size:</span>
                      {variant.size}
                    </Col>
                    <Col xs={12} sm={4} md={2}>
                      <span className="fw-semibold me-1">Quantity:</span>
                      {variant.quantity}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        ))
      ) : (
        <p>No variants available.</p>
      )}
    </Container>
  );
};

export default ViewProduct;
