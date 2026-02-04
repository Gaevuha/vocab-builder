import * as yup from "yup";
import { emailRegex, passwordRegex, enWordRegex, uaWordRegex } from "./regex";

export const registerSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must be 7 chars, include 6 letters and 1 digit"
    ),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      passwordRegex,
      "Password must be 7 chars, include 6 letters and 1 digit"
    ),
});

export const addWordSchema = yup.object({
  category: yup.string().required("Category is required"),
  verbType: yup.string().when("category", {
    is: (value: string) => value === "verb",
    then: (schema) => schema.required("Verb type is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  en: yup
    .string()
    .required("English word is required")
    .matches(enWordRegex, "Invalid English word"),
  ua: yup
    .string()
    .required("Ukrainian word is required")
    .matches(uaWordRegex, "Invalid Ukrainian word"),
});

export const editWordSchema = yup.object({
  en: yup
    .string()
    .required("English word is required")
    .matches(enWordRegex, "Invalid English word"),
  ua: yup
    .string()
    .required("Ukrainian word is required")
    .matches(uaWordRegex, "Invalid Ukrainian word"),
});
