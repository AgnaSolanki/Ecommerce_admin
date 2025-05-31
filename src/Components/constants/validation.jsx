import * as Yup from "yup";
import { CONSTANTS } from "./common";

export const loginValidationSchema = Yup.object().shape({
  [CONSTANTS.email]: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  [CONSTANTS.password]: Yup.string().required("Password is required"),
});