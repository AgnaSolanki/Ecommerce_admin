import authApi from "./authApi";
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
  DashboardStatistics,
} from "./apiRoutes";

const userApi = {
  loginUser: (credentials) => authApi.post(LOGIN, credentials),
  verifyEmail: (data) => authApi.post(VERIFY_EMAIL, data),
  forgotPassword: (data) => authApi.put(UPDATE_PASSWORD, data),
  updateProfile: (data) => authApi.put(UPDATE_PROFILE, data),
  getCountries: () => authApi.get(COUNTRY),
  getStates: (countryId) =>
    authApi.get(STATE.replace("{country_id}", countryId)),
  getCities: (stateId) => authApi.get(CITY.replace("{state_id}", stateId)),
  viewProfile: () => authApi.get(VIEW_PROFILE),
  fileUpload: (file) => {
    const formData = new FormData();
    formData.append("files", file);

    return authApi.post("/fileUpload", formData);
  },
  changePassword: (data) => authApi.put(CHANGE_PASSWORD, data),
  productList: (data) => authApi.post(listOfProduct, data),
  addProduct: (data) => authApi.post(addProduct, data),
  viewProduct: (productId) =>
    authApi.get(viewProduct.replace("{product_id}", productId)),
  editProduct: (productId, data) =>
    authApi.put(editProduct.replace("{product_id}", productId), data),

  deleteProduct: (productId) =>
    authApi.delete(deleteProduct.replace("{product_id}", productId)),
    getCategories:() => authApi.get(getCategories),
    categoryList: (data) => authApi.post(listOfCategory, data),
  addCategory: (data) => authApi.post(addCategory, data),
  updateCategory: (categoryId, data) =>
    authApi.put(updateCategory.replace("{id}", categoryId), data),
  deleteCategory: (categoryId) => 
    authApi.delete(deleteCategory.replace("{id}", categoryId)),
  dashboardStatistics: ()=> authApi.get(DashboardStatistics),

};

export default userApi;
