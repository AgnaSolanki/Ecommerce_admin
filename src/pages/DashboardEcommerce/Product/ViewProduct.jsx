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
      <div className="d-flex justify-content-start">
        <BaseButton
          size="md"
          className=" mb-1"
          onClick={() => navigate(LoginRoutes.PRODUCT_LIST)}
        >
          <IoMdArrowRoundBack size={17} />
        </BaseButton>
      </div>
      <Card className="shadow-sm p-4 bg-light mb-4">
        <h4 className="mb-3 fw-bold">Basic Information</h4>
        <Row className="mb-2">
          <Col md={4} className="mb-3 d-flex align-items-center">
            <span className="fw-semibold me-2">Product ID:</span>
            <Badge color="primary" pill>
              {product.id}
            </Badge>
          </Col>
          <Col md={4} className="mb-3 d-flex align-items-center">
            <span className="fw-semibold me-2">Product Name:</span>
            {product.name}
          </Col>
          <Col md={4} className="mb-3 d-flex align-items-center">
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
              <Row>
                <Col
                  md={2}
                  className="d-flex justify-content-center align-items-center mb-3 mb-md-0"
                >
                  {variant.image?.image_path ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_IMAGE}/${
                        variant.image.image_path
                      }`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = avatar;
                      }}
                      alt="Variant"
                      className="rounded-circle border variant_img"
                    />
                  ) : (
                    <img
                      src={avatar}
                      alt="No Image"
                      className="rounded-circle border variant_img"
                    />
                  )}
                </Col>

                <Col md={10}>
                  <h5 className="fw-bold mb-2">{variant.product_title_name}</h5>

                  <p className="mb-2">
                    <span className="text-success fw-bold me-3">
                      Price ${variant.price}
                    </span>
                    <span className="fw-semibold me-1">Color:</span>{" "}
                    {variant.color}
                  </p>

                  <p className="mb-2">{variant.description}</p>

                  <Row>
                    <Col md={2} className="mb-2">
                      <span className="fw-semibold me-2">ID:</span>
                      <Badge color="primary" pill>
                        {variant.id}
                      </Badge>
                    </Col>
                    <Col md={2} className="mb-2">
                      <span className="fw-semibold me-2">Size:</span>
                      {variant.size}
                    </Col>
                    <Col md={2} className="mb-2">
                      <span className="fw-semibold me-2">Quantity:</span>
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
