import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Table,
  Row,
  Col,
  Modal,
  Tooltip,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { LoginRoutes } from "../../../Routes/apiRoutes";
import { toast } from "react-toastify";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import userApi from "../../../api/userApi";
import BaseLoader from "../../../Components/BASE/BaseLoader";
import BaseInput from "../../../Components/BASE/BaseInput";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { Eye, Edit, Trash2, Search } from "lucide-react";

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
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [tooltip, setTooltip] = useState({
    view: null,
    edit: null,
    delete: null,
  });

  const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE || "";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await userApi.productList({
        page,
        pageSize: limit,
        sortKey: sortKey,
        sortValue: sortOrder,
        search,
      });

      const products = response?.data?.data?.products || [];
      setProductList(products);
      setTotalPages(response?.data?.data?.totalPage || 1);
      setTotalRecords(response?.data?.data?.totalItems || 0);

      if (products.length === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status !== 404) {
        toast.error(err?.response?.data?.message);
      }

      setNoData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search, sortKey, sortOrder]);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setPage(1);
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
    setDeleteLoading(true);

    try {
      const response = await userApi.deleteProduct(selectedProductId);
      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        fetchProducts();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setDeleteModal(false);
      setSelectedProductId(null);
      setDeleteLoading(false);
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

    document.title = "Product";

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
        <Row className="mb-3 align-items-end">
          <Col className="text-end mb-2">
            <BaseButton
              color="primary"
              size="sm"
              onClick={() => navigate(LoginRoutes.ADD_PRODUCT)}
            >
              Add Product
            </BaseButton>
          </Col>
        </Row>

        <Row className="mb-3 align-items-end">
          <Col md="6">
            <div className="d-flex align-items-center">
              <label className="me-2 mb-0 fw-semibold">Items per page:</label>
              <BaseSelectInput
                name="limitSelect"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
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
            </div>
          </Col>

          <Col md="6" className="text-end">
            <div className="d-flex justify-content-end align-items-center gap-2">
              <BaseInput
                id="productSearch"
                name="productSearch"
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                  setLoading(true);
                  setSearch(e.target.value.trim());
                }}
                icon={<Search size={16} />}
              />
            </div>
          </Col>
        </Row>

        <Card className="mb-4">
          <CardBody>
            <Table responsive bordered hover>
              <thead className="table-light">
                <tr>
                  <th>No.</th>
                  <th onClick={() => handleSort("name")} className="cursor">
                    Product Name
                    {sortKey === "name" &&
                      (sortOrder === "asc" ? (
                        <FaSortUp className="ms-1" />
                      ) : (
                        <FaSortDown className="ms-1" />
                      ))}
                  </th>
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
                ) : noData ? (
                  <tr>
                    <td colSpan="4">
                      <div className="d-flex justify-content-center align-items-center my-5">
                        <h5>Sorry! No result found.</h5>
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
                            <span
                              id={`viewBtn_${product.id}`}
                              onClick={() => handleView(product.id)}
                              className="cursor"
                            >
                              <Eye size={18} color="#0dcaf0" />
                            </span>
                            <Tooltip
                              isOpen={tooltip.view === product.id}
                              target={`viewBtn_${product.id}`}
                              toggle={() =>
                                setTooltip((prev) => ({
                                  ...prev,
                                  view:
                                    prev.view === product.id
                                      ? null
                                      : product.id,
                                }))
                              }
                            >
                              View
                            </Tooltip>

                            <span
                              id={`editBtn_${product.id}`}
                              onClick={() => handleEdit(product.id)}
                              className="cursor"
                            >
                              <Edit size={18} color="#ffc107" />
                            </span>
                            <Tooltip
                              isOpen={tooltip.edit === product.id}
                              target={`editBtn_${product.id}`}
                              toggle={() =>
                                setTooltip((prev) => ({
                                  ...prev,
                                  edit:
                                    prev.edit === product.id
                                      ? null
                                      : product.id,
                                }))
                              }
                            >
                              Edit
                            </Tooltip>

                            <span
                              id={`deleteBtn_${product.id}`}
                              onClick={() => confirmDelete(product.id)}
                              className="cursor"
                            >
                              <Trash2 size={18} color="#dc3545" />
                            </span>
                            <Tooltip
                              isOpen={tooltip.delete === product.id}
                              target={`deleteBtn_${product.id}`}
                              toggle={() =>
                                setTooltip((prev) => ({
                                  ...prev,
                                  delete:
                                    prev.delete === product.id
                                      ? null
                                      : product.id,
                                }))
                              }
                            >
                              Delete
                            </Tooltip>
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

            {renderPagination()}
          </CardBody>
        </Card>
        <h6 className="mb-3">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalRecords)} of {totalRecords} Results
        </h6>
      </Container>

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <Card className="p-4 text-center border-0">
          <h4 className="mb-3 fw-bold">Are you sure?</h4>
          <p className="mb-4">Are you sure you want to remove this record?</p>

          <div className="d-flex justify-content-center gap-3">
            <BaseButton color="secondary" onClick={() => setDeleteModal(false)}>
              Close
            </BaseButton>
            <BaseButton
              color="danger"
              onClick={handleDelete}
              loading={deleteLoading}
              className="fix-button-delete"
            >
              {!deleteLoading ? "Yes, Delete It!" : null}
            </BaseButton>
          </div>
        </Card>
      </Modal>
    </div>
  );
};

export default ProductList;
