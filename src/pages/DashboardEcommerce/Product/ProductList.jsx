import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Button,
  Input,
  Row,
  Col,
} from "reactstrap";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import authService from "../../../api/apiServices";
import { useNavigate } from "react-router-dom";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import { toast } from "react-toastify";

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await authService.productList({
        page: page,
        pageSize: limit,
        sortKey: "id",
        sortValue: "desc",
        search: "",
      });

      setProductList(response?.data?.data?.products || []);
      setTotalPages(response?.data?.data?.totalPage || 1);
      setTotalRecords(response?.data?.data?.totalItems || 0);
    } catch (err) {
      console.error("Error fetching products:", err.message);
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  const onLimitChange = (e) => {
    setLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleView = (productId) => {
    navigate(`${LoginRoutes.VIEW_PRODUCT}/${productId}`);
    console.log(`${LoginRoutes.VIEW_PRODUCT}/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`${LoginRoutes.EDIT_PRODUCT}/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await authService.deleteProduct(productId);
        console.log("product id", productId);

        if (response?.data?.statusCode === 200) {
          toast.success("Product deleted successfully");
          fetchProducts();
        } else {
          toast.error(response?.data?.message || "Failed to delete product");
        }
      } catch (err) {
        console.error("Delete error:", err.message);
        toast.error("Error deleting product");
      }
    }
  };

  const renderPagination = () => {
    let pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (page >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
      }
    }

    return (
      <div className="d-flex flex-end align-items-center justify-content-end flex-wrap mt-3">
        <Button
          color="primary"
          size="sm"
          className="me-2"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </Button>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={index} className="me-2">
              ...
            </span>
          ) : (
            <Button
              key={index}
              size="sm"
              color={item === page ? "dark" : "secondary"}
              className="me-2"
              onClick={() => goToPage(item)}
            >
              {item}
            </Button>
          )
        )}

        <Button
          color="primary"
          size="sm"
          className="ms-2"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </Button>
      </div>
    );
  };

  return (
    <div className="page-content mt-lg-5 w-100">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col md="4" xs="12" className="mb-2 mb-md-0">
            <label htmlFor="limitSelect" className="me-2">
              Items per page:
            </label>
            <Input
              type="select"
              id="limitSelect"
              value={limit}
              onChange={onLimitChange}
              style={{ width: "100px", display: "inline-block" }}
            >
              <option value={5}>5</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
            </Input>
          </Col>
          <Col md="8" xs="12" className="text-md-end">
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => navigate(LoginRoutes.ADD_PRODUCT)}
            >
              Add Product
            </BaseButton>
          </Col>
        </Row>

        {error && <p className="text-danger">{error}</p>}

        <h4 className="mb-3">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalRecords)} of {totalRecords} Results
        </h4>

        <Card className="mb-4">
          <CardBody>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
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
                      const variant = product.variants?.[0] || {};
                      const imagePath = variant?.image?.image_path;

                      return (
                        <tr key={product.id}>
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>{product.name}</td>
                          <td>
                            <img
                              src={
                                imagePath
                                  ? `${import.meta.env.REACT_APP_IMAGE_URL}/${imagePath}`
                                  : avatar
                              } 
                              alt="Product"
                              width="50"
                              height="50"
                            />
                          </td>
                          <td>
                            <Button
                              size="sm"
                              color="info"
                              className="me-2"
                              onClick={() => handleView(product.id)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              color="warning"
                              className="me-2"
                              onClick={() => handleEdit(product.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No Products Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}

            {renderPagination()}
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ProductList;
