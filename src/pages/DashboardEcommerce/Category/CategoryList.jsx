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
    const category = categoryList.find(
      (categories) => categories.id === categoryId
    );
    setEditCategory(category);
    setModalOpen(true);
  };
  const uploadImageFile = async (image) => {
    if (!image) return null;
    if (typeof image === "string") return image;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await userApi.uploadImage(formData);
      return response?.data?.data?.file_name;
    } catch (err) {
      toast.error(err?.message);
      throw new Error(err);
    }
  };

  const handleSaveCategory = async (form) => {
    const trimmedName = String(form.category_name || "").trim();
    const trimmedDesc = String(form.description || "").trim();

    let imageValue;
    try {
      imageValue = await uploadImageFile(form.category_image);
    } catch {
      return;
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
      setImagePreview(
        `${import.meta.env.VITE_BASE_IMAGE}${formik.values.category_image}`
      );
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
              label={CONSTANTS.categoryName}
              name={CONSTANTS.category_name}
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
              label={CONSTANTS.Description}
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
              label={CONSTANTS.CategoryImage}
              name={CONSTANTS.category_image}
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
                { label: "10", value: 10 },
                { label: "20", value: 20 },
                { label: "50", value: 50 },
                { label: "100", value: 100 },
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
                    categoryList.map((categories, index) => {
                      const imagePath = categories?.category_image;

                      let imageUrl = avatar;
                      if (imagePath && !imagePath.startsWith("http")) {
                        imageUrl = `${IMAGE_BASE_URL}/${imagePath}`;
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
                          <td>
                            <BaseButton
                              size="sm"
                              color="warning"
                              onClick={() => handleEdit(categories.id)}
                              className="me-2"
                            >
                              Edit
                            </BaseButton>
                            <BaseButton
                              size="sm"
                              color="danger"
                              onClick={() => confirmDelete(categories.id)}
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
