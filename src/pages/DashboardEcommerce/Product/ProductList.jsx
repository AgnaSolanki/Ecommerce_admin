import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import { toast } from "react-toastify";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import userApi from "../../../api/userApi";
import BaseLoader from "../../../Components/BASE/BaseLoader";
import { Search } from "lucide-react";
import BaseInput from "../../../Components/BASE/BaseInput";

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [noData, setNoData] = useState(false);

  const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE || "";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await userApi.productList({
        page,
        pageSize: limit,
        sortKey: "id",
        sortValue: "desc",
        search,
      });

      setProductList(response?.data?.data?.products || []);
      setTotalPages(response?.data?.data?.totalPage || 1);
      setTotalRecords(response?.data?.data?.totalItems || 0);
    } catch (err) {
      toast.error(err?.response?.data.message);
      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim() !== "" || searchInput.trim() === "") {
      fetchProducts();
    }
  }, [page, limit, search]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleView = (productId) => {
    navigate(`${LoginRoutes.VIEW_PRODUCT}/${productId}`);
  };

  const handleEdit = (productId) => {
    navigate(`${LoginRoutes.EDIT_PRODUCT}/${productId}`);
  };

  const confirmDelete = (productId) => {
    setSelectedProductId(productId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await userApi.deleteProduct(selectedProductId);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        fetchProducts();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setDeleteModal(false);
      setSelectedProductId(null);
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
        <BaseButton
          color="primary"
          size="sm"
          className="me-2"
          disabled={page === 1}
          onClick={() => goToPage(page - 1)}
        >
          Previous
        </BaseButton>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={index} className="me-2">
              ...
            </span>
          ) : (
            <BaseButton
              key={index}
              size="sm"
              color={item === page ? "dark" : "secondary"}
              className="me-2"
              onClick={() => goToPage(item)}
            >
              {item}
            </BaseButton>
          )
        )}

        <BaseButton
          color="primary"
          size="sm"
          className="ms-2"
          disabled={page === totalPages}
          onClick={() => goToPage(page + 1)}
        >
          Next
        </BaseButton>
      </div>
    );
  };

  return (
    <div className="page-content w-100">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col
            md="4"
            xs="12"
            className="mb-2 mb-md-0 d-flex align-items-center"
          >
            <label htmlFor="limitSelect" className="me-2 mb-0">
              Items per page:
            </label>
            <BaseSelectInput
              id="limitSelect"
              name="limitSelect"
              value={limit}
              onChange={(e) => {
                const selectedValue = parseInt(e.target.value, 10);
                setLimit(selectedValue);
                setPage(1);
              }}
              options={[
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
              ]}
            />
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
        <Row>
          <Col md="6" className="mb-2">
            <BaseInput
              id="productSearch"
              name="productSearch"
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => {
                const value = e.target.value;
                setSearchInput(value);

                setNoData(false);
              }}
              onIconClick={() => {
                setSearch(searchInput);
                setPage(1);
              }}
              icon={<Search size={16} />}
            />
          </Col>
        </Row>
        <Card className="mb-4">
          <CardBody>
            {noData ? (
              <div className="text-center my-4">
                <h5>No matching customers found.</h5>
              </div>
            ) : (
              <Table responsive bordered hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4">
                        <div className="d-flex justify-content-center align-items-center my-5">
                          <BaseLoader size={30} />
                        </div>
                      </td>
                    </tr>
                  ) : productList.length > 0 ? (
                    productList.map((product, index) => {
                      const variant = product.variants?.[0] || {};
                      const imagePath = variant?.image?.image_path;

                      let imageUrl = avatar;
                      if (imagePath && !imagePath.startsWith("http")) {
                        imageUrl = `${IMAGE_BASE_URL}/${imagePath}`;
                      } else if (imagePath) {
                        imageUrl = imagePath;
                      }

                      return (
                        <tr key={product.id}>
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>{product.name}</td>
                          <td>
                            <img
                              src={imageUrl}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = avatar;
                              }}
                              alt="Product"
                              width="50"
                              height="50"
                            />
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2 flex-wrap">
                              <BaseButton
                                size="sm"
                                color="info"
                                className="me-4"
                                onClick={() => handleView(product.id)}
                              >
                                View
                              </BaseButton>
                              <BaseButton
                                size="sm"
                                color="warning"
                                className="me-4"
                                onClick={() => handleEdit(product.id)}
                              >
                                Edit
                              </BaseButton>
                              <BaseButton
                                size="sm"
                                color="danger"
                                onClick={() => confirmDelete(product.id)}
                              >
                                Delete
                              </BaseButton>
                            </div>
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
        <h6 className="mb-3">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalRecords)} of {totalRecords} Results
        </h6>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this product?</ModalBody>
        <ModalFooter>
          <BaseButton color="danger" onClick={handleDelete}>
            Delete
          </BaseButton>{" "}
          <BaseButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </BaseButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProductList;
