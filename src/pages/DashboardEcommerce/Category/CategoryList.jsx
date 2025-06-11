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
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import avatar from "../../../assets/images/users/user-dummy-img.jpg";
import BaseButton from "../../../Components/BASE/BaseButton";
import BaseSelectInput from "../../../Components/BASE/BaseSelectInput";
import userApi from "../../../api/userApi";

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
            console.log(err);

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
    setModalLoading(true);
    try {
      const formData = new FormData();

      formData.append("category_name", String(form.category_name || ""));
      formData.append("description", String(form.description || ""));

      if (form.category_image instanceof File) {
        formData.append("category_image", form.category_image);
      }

      if (editCategory?.id) {
        const response = await userApi.updateCategory(
          editCategory.id,
          formData
        );
        console.log("res update", response);
        toast.success("Category updated!");
      } else {
        const res = await userApi.addCategory(formData);
        console.log("add res", res);
        toast.success("Category added!");
      }

      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err?.message);
      console.log(err);
      
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await userApi.deleteCategory(selectedCategoryId);
      console.log("res ...", response);

      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message);
        fetchCategories();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.message);
            console.log(err);

    } finally {
      setDeleteModal(false);
      setSelectedCategoryId(null);
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

  const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE || "";

  const CategoryModal = ({
    isOpen,
    toggle,
    onSave,
    initialData,
    loading,
    title,
  }) => {
    const formik = useFormik({
      initialValues: initialData,
      enableReinitialize: true,
      validationSchema: Yup.object({
        category_name: Yup.string().required("Category Name is required"),
        description: Yup.string().required("Description is required"),
        category_image: editCategory
          ? Yup.mixed()
          : Yup.mixed().required("Category Image is required"),
      }),
      onSubmit: (values) => {
        console.log("Formik Submit Values:", values);
        onSave(values);
      },
    });

    return (
      <Modal isOpen={isOpen} toggle={toggle} size="md">
        <Form onSubmit={formik.handleSubmit}>
          <ModalHeader toggle={toggle}>{title}</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label>
                Category Name <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                name="category_name"
                value={formik.values.category_name}
                onChange={formik.handleChange}
                invalid={
                  formik.touched.category_name && !!formik.errors.category_name
                }
              />
              <FormFeedback>{formik.errors.category_name}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>
                Description <span className="text-danger">*</span>
              </Label>
              <Input
                type="textarea"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                invalid={
                  formik.touched.description && !!formik.errors.description
                }
              />
              <FormFeedback>{formik.errors.description}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Label>
                Category Image <span className="text-danger">*</span>
              </Label>
              <Input
                type="file"
                name="category_image"
                onChange={(e) => {
                  formik.setFieldValue(
                    "category_image",
                    e.currentTarget.files[0]
                  );
                }}
                invalid={
                  formik.touched.category_image &&
                  !!formik.errors.category_image
                }
              />
              <FormFeedback>{formik.errors.category_image}</FormFeedback>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <BaseButton type="submit" color="primary" loading={loading}>
              {title}
            </BaseButton>
            <BaseButton type="button" color="secondary" onClick={toggle}>
              Cancel
            </BaseButton>
          </ModalFooter>
        </Form>
      </Modal>
    );
  };

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
                      const imageUrl = cat.category_image
                        ? `${IMAGE_BASE_URL}/${cat.category_image}`
                        : avatar;
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this category?</ModalBody>
        <ModalFooter>
          <BaseButton color="danger" onClick={handleDelete}>
            Delete
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
