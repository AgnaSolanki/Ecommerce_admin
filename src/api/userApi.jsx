import apiService from "./apiServices";
import {
  LOGIN,
  VERIFY_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  CITY,
  COUNTRY,
  STATE,
  VIEW_PROFILE,
  CHANGE_PASSWORD,
  listOfProduct,
  addProduct,
  viewProduct,
  editProduct,
  deleteProduct,
  getCategories,
  listOfCategory,
  addCategory,
  updateCategory,
  deleteCategory,
} from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => apiService.post(LOGIN, credentials),
  verifyEmail: (data) => apiService.post(VERIFY_EMAIL, data),
  forgotPassword: (data) => apiService.put(UPDATE_PASSWORD, data),
  updateProfile: (data) => apiService.put(UPDATE_PROFILE, data),
  getCountries: () => apiService.get(COUNTRY),
  getStates: (countryId) =>
    apiService.get(STATE.replace("{country_id}", countryId)),
  getCities: (stateId) => apiService.get(CITY.replace("{state_id}", stateId)),
  viewProfile: () => apiService.get(VIEW_PROFILE),
  fileUpload: (file) => {
    const formData = new FormData();
    formData.append("files", file);

    return apiService.post("/fileUpload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  changePassword: (data) => apiService.put(CHANGE_PASSWORD, data),
  productList: (data) => apiService.post(listOfProduct, data),
  addProduct: (data) => apiService.post(addProduct, data),
  viewProduct: (productId) =>
    apiService.get(viewProduct.replace("{product_id}", productId)),
  editProduct: (productId, data) =>
    apiService.put(editProduct.replace("{product_id}", productId), data),

  deleteProduct: (productId) =>
    apiService.delete(deleteProduct.replace("{product_id}", productId)),
    getCategories:() => apiService.get(getCategories),
    categoryList: (data) => apiService.post(listOfCategory, data),
  addCategory: (data) => apiService.post(addCategory, data),
  updateCategory: (categoryId, data) =>
    apiService.put(updateCategory.replace("{id}", categoryId), data),
  deleteCategory: (categoryId) => 
    apiService.delete(deleteCategory.replace("{id}", categoryId))

};

export default userApi;
