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
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import userApi from "../../../api/userApi";
import {
  inputField,
  validationField,
} from "../../../Components/constants/validation";
import { CONSTANTS } from "../../../Components/constants/common";
import BaseInput from "../../../Components/BASE/BaseInput";
import BaseFileInput from "../../../Components/BASE/BaseFileInput";

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

  const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE || "";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await userApi.categoryList({
        page,
        pageSize: limit,
        sortKey: "category_name",
        sortValue: "asc",
        search: "",
      });

      const data = response?.data?.data;
      setCategoryList(data?.categories || []);
      setTotalPages(data?.totalPage || 1);
      setTotalRecords(data?.totalItems || 0);
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  const handleAddCategory = () => {
    setEditCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (categoryId) => {
    const category = categoryList.find((cat) => cat.id === categoryId);
    setEditCategory(category);
    setModalOpen(true);
  };

  const handleSaveCategory = async (form) => {
    const trimmedName = String(form.category_name || "").trim();
    const trimmedDesc = String(form.description || "").trim();

    let imageValue = null;

    if (typeof form.category_image === "string" && form.category_image !== "") {
      imageValue = form.category_image;
    } else if (typeof form.category_image === "object" && form.category_image) {
      const imageForm = new FormData();
      imageForm.append("image", form.category_image);

      try {
        const imageUploadResponse = await userApi.uploadImage(imageForm);
        imageValue = imageUploadResponse?.data?.data?.file_name;
      } catch (err) {
        toast.error(err.message);
        return;
      }
    }

    setModalLoading(true);
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
      setEditCategory(null);
      fetchCategories();
    } catch (err) {
      const errorMessages = err?.response?.data?.message;

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
      setDeleteLoading(true);
    }
  };

  const renderPagination = () => {
    let pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
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
            <span key={index} className="me-2">
              ...
            </span>
          ) : (
            <BaseButton
              key={index}
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
    const imageValidation = validationField(CONSTANTS.category_image);
    const formik = useFormik({
      initialValues: initialData,
      enableReinitialize: true,
      validationSchema: Yup.object({
        category_name: Yup.string()
          .required(categoryValidation.required)
          .max(50, categoryValidation.maxLength(CONSTANTS.Category, 50)),
        description: Yup.string()
          .required(descriptionValidation.required)
          .max(
            255,
            descriptionValidation.maxLength(CONSTANTS.Description, 255)
          ),
        category_image: editCategory
          ? Yup.mixed()
          : Yup.mixed().required(imageValidation.required),
      }),
      onSubmit: (values) => {
        onSave(values);
      },
    });

    useEffect(() => {
      if (typeof formik.values.category_image === "string") {
        setImagePreview(
          `${import.meta.env.VITE_BASE_IMAGE}${formik.values.category_image}`
        );
      } else {
        setImagePreview("");
      }
    }, [formik.values.category_image]);

    const handleImageUpload = async (file) => {
      if (file) {
        try {
          const uploadRes = await userApi.fileUpload(file);
          const fileData = uploadRes.data?.data;
          const fileName = Array.isArray(fileData) ? fileData[0] : fileData;

          if (fileName) {
            formik.setFieldValue("category_image", fileName);
            const imageURL = `${import.meta.env.VITE_BASE_IMAGE}${fileName}`;
            setImagePreview(imageURL);
          }
        } catch (err) {
          toast.error(err.message);
        }
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
              label="Category Name"
              name="category_name"
              type={CONSTANTS.text}
              value={formik.values.category_name}
              placeholder={inputField(CONSTANTS.categoryName)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.category_name && formik.errors.category_name && (
              <FormFeedback className="d-block">
                {formik.errors.category_name}
              </FormFeedback>
            )}

            <BaseInput
              label="Description"
              name={CONSTANTS.description}
              type="textarea"
              placeholder={inputField(CONSTANTS.description)}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <FormFeedback className="d-block">
                {formik.errors.description}
              </FormFeedback>
            )}

            <BaseFileInput
              label="Category Image"
              name="category_image"
              onChange={(e) => handleImageUpload(e.target.files[0])}
            />

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
            <BaseButton type="submit" color="primary" loading={loading}>
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
    <div className="page-content mt-4">
      <Container fluid>
        <Row className="mb-3 align-items-center">
          <Col md="4">
            <label className="me-2">Items per page:</label>
            <BaseSelectInput
              name="limitSelect"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              options={[
                { label: "5", value: 5 },
                { label: "15", value: 15 },
                { label: "25", value: 25 },
              ]}
            />
          </Col>
          <Col md="8" className="text-end">
            <BaseButton color="primary" size="sm" onClick={handleAddCategory}>
              Add Category
            </BaseButton>
          </Col>
        </Row>

        <h5>
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalRecords)} of {totalRecords}
        </h5>

        <Card>
          <CardBody>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <Table bordered responsive hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.length > 0 ? (
                    categoryList.map((cat, index) => {
                      const imagePath = cat?.category_image;

                      let imageUrl = avatar;
                      if (imagePath && !imagePath.startsWith("http")) {
                        imageUrl = `${IMAGE_BASE_URL}/${imagePath}`;
                      } else if (imagePath) {
                        imageUrl = imagePath;
                      }

                      return (
                        <tr key={cat.id}>
                          <td>{(page - 1) * limit + index + 1}</td>
                          <td>{cat.category_name}</td>
                          <td>{cat.description}</td>
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
                          <td>
                            <BaseButton
                              size="sm"
                              color="warning"
                              onClick={() => handleEdit(cat.id)}
                              className="me-2"
                            >
                              Edit
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              color="danger"
                              onClick={() => confirmDelete(cat.id)}
                            >
                              Delete
                            </BaseButton>
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
            )}
            {renderPagination()}
          </CardBody>
        </Card>
      </Container>

      <CategoryModal
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        onSave={handleSaveCategory}
        initialData={
          editCategory || {
            category_name: "",
            description: "",
            category_image: null,
          }
        }
        loading={modalLoading}
        title={editCategory ? "Update Category" : "Add Category"}
      />

      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this category?</ModalBody>
        <ModalFooter>
          <BaseButton
            color="danger"
            onClick={handleDelete}
            loading={deleteLoading}
          >
            {!deleteLoading ? "Delete" : null}
          </BaseButton>
          <BaseButton color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </BaseButton>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CategoryList;
