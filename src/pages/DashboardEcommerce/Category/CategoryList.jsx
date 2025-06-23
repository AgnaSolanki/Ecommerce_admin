import { useEffect, useState } from "react";
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
  Form,
  FormFeedback,
  Tooltip,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import userApi from "../../../api/userApi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { useMemo } from "react";

import {
  inputField,
  validationField,
} from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseFileInput from "../../../Components/BASE/BaseFileInput";
import { Search } from "lucide-react";
import BaseLoader from "../../../Components/BASE/BaseLoader";

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [noData, setNoData] = useState(false);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editTooltip, setEditTooltip] = useState(null);
  const [deleteTooltip, setDeleteTooltip] = useState(null);

  const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE || "";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await userApi.categoryList({
        page,
        pageSize: limit,
        sortKey: sortKey,
        sortValue: sortOrder,
        search,
      });

      const data = response?.data?.data;
      const newCategories = data?.categories || [];

      if (JSON.stringify(newCategories) !== JSON.stringify(categoryList)) {
        setCategoryList(newCategories);
      }

      setTotalPages(data?.totalPage || 1);
      setTotalRecords(data?.totalItems || 0);
      setNoData(newCategories.length === 0);
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
   
      fetchCategories();
  
  }, [page, limit, search, sortKey, sortOrder]);
  const initialFormData = useMemo(() => {
    return editCategory
      ? editCategory
      : {
          category_name: "",
          description: "",
          category_image: null,
        };
  }, [editCategory]);

  const handleAddCategory = () => {
    setEditCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (categoryId) => {
    const category = categoryList.find((c) => c.id === categoryId);
    if (category) {
      setEditCategory(category);
     setModalOpen(true);
    }
  };
  const handleSaveCategory = async (form) => {
    const trimmedName = String(form.category_name || "").trim();
    const trimmedDesc = String(form.description || "").trim();

    let imageValue = form.category_image;

    try {
      const payload = {
        category_name: trimmedName,
        description: trimmedDesc,
        category_image: imageValue,
      };

      if (editCategory?.id) {
        const res = await userApi.updateCategory(editCategory.id, payload);
        toast.success(res?.data?.message);
      } else {
        const res = await userApi.addCategory(payload);
        toast.success(res?.data?.message);
      }

      setModalOpen(false);

      fetchCategories();
    } catch (err) {
      const errorMessages = err?.response?.data?.message;
      setNoData(true);
      if (Array.isArray(errorMessages)) {
        errorMessages.forEach((msg) => toast.error(msg));
      } else {
        toast.error(err?.message);
      }
    } finally {
      setModalLoading(false);
    }
  };
  const confirmDelete = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await userApi.deleteCategory(selectedCategoryId);

      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        fetchCategories();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setDeleteModal(false);
      setSelectedCategoryId(null);
      setDeleteLoading(false);
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

  const renderPagination = () => {
    const pages = [];

    switch (true) {
      case totalPages <= 5:
        for (let i = 1; i <= totalPages; i++) pages.push(i);
        break;

      case page <= 3:
        pages.push(1, 2, 3, 4, "...", totalPages);
        break;

      case page >= totalPages - 2:
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
        break;

      default:
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        break;
    }

    document.title = "Category";
    return (
      <div className="d-flex justify-content-end mt-3">
        <BaseButton
          size="sm"
          color="primary"
          className="me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </BaseButton>

        {pages.map((item, index) =>
          item === "..." ? (
            <span key={`ellipsis-${index}`} className="me-2">
              ...
            </span>
          ) : (
            <BaseButton
              key={`page-${item}`}
              size="sm"
              color={item === page ? "dark" : "secondary"}
              className="me-2"
              onClick={() => setPage(item)}
            >
              {item}
            </BaseButton>
          )
        )}

        <BaseButton
          size="sm"
          color="primary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </BaseButton>
      </div>
    );
  };

  const CategoryModal = ({
    isOpen,
    toggle,
    onSave,
    initialData,
    loading,
    title,
  }) => {
    const [imagePreview, setImagePreview] = useState("");
    const categoryValidation = validationField(CONSTANTS.Category);
    const descriptionValidation = validationField(CONSTANTS.Description);
    const imageValidation = validationField(CONSTANTS.CategoryImage);
    const formik = useFormik({
      initialValues: initialData,
      enableReinitialize: true,
      validationSchema: Yup.object({
        category_name: Yup.string()
          .required(categoryValidation.required)
          .max(50, categoryValidation.maxLength(CONSTANTS.Category, 50)),
        description: Yup.string()
          .max(
            255,
            descriptionValidation.maxLength(CONSTANTS.Description, 255)
          ),
        category_image: Yup.mixed()
          .nullable()
          .test("fileSize", imageValidation.imageSize, function (value) {
            if (!value) return true;
            if (typeof value === "string") return true;
            return value.size <= 1024 * 1024;
          }),
      }),
      onSubmit: (values) => {
        onSave(values);
      },
    });

    useEffect(() => {
      setImagePreview(`${IMAGE_BASE_URL}${formik.values.category_image}`);
    }, [formik.values.category_image]);

    const handleImageUpload = async (file) => {
      if (!file) return;

      const schema = Yup.mixed()
        .test("fileSize", imageValidation.imageSize, (value) => {
          if (!value) return true;
          if (typeof value === "string") return true;
          return value.size <= 1024 * 1024;
        });

      try {
        await schema.validate(file);

        const uploadRes = await userApi.fileUpload(file);
        const fileData = uploadRes.data?.data;
        const fileName = Array.isArray(fileData) ? fileData[0] : fileData;

        if (fileName) {
          const imageURL = `${IMAGE_BASE_URL}${fileName}`;

          formik.setFieldValue("category_image", fileName);
          setImagePreview(imageURL);
          formik.setFieldError("category_image", "");
        }
      } catch (err) {
        toast.error(err?.message);

        formik.setFieldError("category_image", err?.message);
        formik.setTouched({ ...formik.touched, category_image: true });
      }
    };

    const handleClose = () => {
      formik.resetForm();
      toggle();
      setImagePreview("");
    };

    return (
      <Modal isOpen={isOpen} toggle={handleClose} size="md">
        <Form onSubmit={formik.handleSubmit}>
          <ModalHeader toggle={handleClose}>{title}</ModalHeader>
          <ModalBody>
            <BaseInput
              label={CONSTANTS.categoryName}
              name={CONSTANTS.category_name}
              type={CONSTANTS.text}
              value={formik.values.category_name}
              placeholder={inputField(CONSTANTS.categoryName)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required={true}
            />
            {formik.touched.category_name && formik.errors.category_name && (
              <FormFeedback className="d-block">
                {formik.errors.category_name}
              </FormFeedback>
            )}
            <br />
            <BaseInput
              label={CONSTANTS.Description}
              name={CONSTANTS.description}
              type="textarea"
              placeholder={inputField(CONSTANTS.description)}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <br />

            <BaseFileInput
              label={CONSTANTS.CategoryImage}
              name={CONSTANTS.category_image}
              formik={formik}
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />
            {formik.touched.category_image && formik.errors.category_image && (
              <FormFeedback className="d-block">
                {formik.errors.category_image}
              </FormFeedback>
            )}

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = avatar;
                }}
                className="imgPreview"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <BaseButton
              type="submit"
              color="primary"
              loading={loading}
              className="fix-button"
            >
              {!loading ? title : null}
            </BaseButton>
            <BaseButton type="button" color="secondary" onClick={handleClose}>
              Cancel
            </BaseButton>
          </ModalFooter>
        </Form>
      </Modal>
    );
  };

  document.title = "Category";

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col className="text-end">
            <BaseButton color="primary" size="sm" onClick={handleAddCategory}>
              Add Category
            </BaseButton>
          </Col>
        </Row>
        <Row className="mb-3 align-items-end">
          <Col md="6">
            <div className="d-flex align-items-center">
              <label className="me-2 mb-0">Items per page:</label>
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
                id="categorySearch"
                name="categorySearch"
                type="text"
                placeholder="Search categories..."
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

        <Card>
          <CardBody>
            <Table bordered responsive hover>
              <thead className="table-light">
                <tr>
                  <th>No.</th>
                  <th
                    className="cursor"
                    onClick={() => handleSort("category_name")}
                  >
                    Category Name{" "}
                    {sortKey === "category_name" &&
                      (sortOrder === "asc" ? (
                        <FaSortUp size={14} />
                      ) : (
                        <FaSortDown size={14} />
                      ))}
                  </th>
                  <th
                    className="cursor"
                    onClick={() => handleSort("description")}
                  >
                    Description{" "}
                    {sortKey === "description" &&
                      (sortOrder === "asc" ? (
                        <FaSortUp size={14} />
                      ) : (
                        <FaSortDown size={14} />
                      ))}
                  </th>
                  <th>Image</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5">
                      <div className="d-flex justify-content-center align-items-center my-5">
                        <BaseLoader size={30} />
                      </div>
                    </td>
                  </tr>
                ) : noData ? (
                  <tr>
                    <td colSpan="5">
                      <div className="text-center my-5">
                        <h5>Sorry! No data found.</h5>
                      </div>
                    </td>
                  </tr>
                ) : categoryList.length > 0 ? (
                  categoryList.map((categories, index) => {
                    const imagePath = categories?.category_image;

                    let imageUrl = avatar;
                    if (imagePath && !imagePath.startsWith("http")) {
                      imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
                    } else if (imagePath) {
                      imageUrl = imagePath;
                    }

                    return (
                      <tr key={categories.id}>
                        <td>{(page - 1) * limit + index + 1}</td>
                        <td>{categories.category_name}</td>
                        <td>{categories.description}</td>
                        <td>
                          <img
                            src={imageUrl}
                            alt="Category"
                            width="50"
                            height="50"
                            className="image-category"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = avatar;
                            }}
                          />
                        </td>
                        <td className="d-flex justify-content-center gap-2 flex-wrap">
                          <span
                            id={`edit-${categories.id}`}
                            onClick={() => handleEdit(categories.id)}
                            className="cursor"
                          >
                            <FiEdit size={18} color="#f0ad4e" />
                          </span>
                          <Tooltip
                            isOpen={editTooltip === categories.id}
                            target={`edit-${categories.id}`}
                            toggle={() =>
                              setEditTooltip(
                                editTooltip === categories.id
                                  ? null
                                  : categories.id
                              )
                            }
                          >
                            Edit
                          </Tooltip>

                          <span
                            id={`delete-${categories.id}`}
                            onClick={() => confirmDelete(categories.id)}
                            className="cursor"
                          >
                            <FiTrash2 size={18} color="#dc3545" />
                          </span>
                          <Tooltip
                            isOpen={deleteTooltip === categories.id}
                            target={`delete-${categories.id}`}
                            toggle={() =>
                              setDeleteTooltip(
                                deleteTooltip === categories.id
                                  ? null
                                  : categories.id
                              )
                            }
                          >
                            Delete
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No categories found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            {renderPagination()}
          </CardBody>
        </Card>
        <h6>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalRecords)} of {totalRecords}
        </h6>
      </Container>

      {modalOpen && (
        <CategoryModal
          isOpen={modalOpen}
          toggle={() => setModalOpen(false)}
          onSave={handleSaveCategory}
          initialData={initialFormData}
          loading={modalLoading}
          title={editCategory ? "Update" : "Submit"}
        />
      )}

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered>
        <Card className="p-4 text-center border-0">
          <h4 className="mb-3 fw-bold">Are you sure?</h4>
          <p className="mb-4">Are you sure you want to remove this record?</p>

          <div className="d-flex justify-content-center gap-3">
            <BaseButton
              color="secondary"
              onClick={() => setDeleteModal(false)}
              disabled={deleteLoading}
            >
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

export default CategoryList;
