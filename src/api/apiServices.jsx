import authApi from "./authApi";

import {
  LOGIN,
  VERIFY_EMAIL,
  UPDATE_PASSWORD,
  UPDATE_PROFILE,
  VIEW_PROFILE,
  UPLOAD_FILE,
  CHANGE_PASSWORD,
  listOfProduct,
  addProduct,
  viewProduct,
  editProduct,
  deleteProduct,
  getCategories,
} from "./apiRoutes";

const authService = {
  login: (data) => authApi.post(LOGIN, data),
  verifyEmail: (email) => authApi.post(VERIFY_EMAIL, { email }),
  forgotPassword: (data) => authApi.put(UPDATE_PASSWORD, data),
  updateProfile: (data) => authApi.put(UPDATE_PROFILE, data),
  viewProfile: () => authApi.get(VIEW_PROFILE),
  fileUpload: (file) =>
    authApi.post(UPLOAD_FILE, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
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
};


export default authService;
