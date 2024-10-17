import {z} from "zod";

export const RegisterValidation = z
  .object({
    email: z.string().email().min(1, {message: "email is required"}),
    password: z.string().min(1, {message: "password is required"}),
    cf_password: z.string().min(1, {message: "confirm password is required"}),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "password and confirm password not match",
    path: ["cf_password"],
  });

export const LoginValidation = z.object({
  email: z.string().email().min(1, {message: "email is required"}),
  password: z.string().min(1, {message: "password is required"}),
});

export const ProfileValidation = z.object({
  name: z
    .string()
    .min(3, {message: "minimum 3 characters long."})
    .max(12, {message: "maximum 12 characters long."}),
  username: z
    .string()
    .min(3, {message: "minimum 3 characters long."})
    .max(12, {message: "maximum 12 characters long."}),
  bio: z
    .string()
    .min(10, {message: "minimum 10 characters long."})
    .max(50, {message: "maximum 50 characters long."}),
  avatar: z.string().url().min(1, {message: "avatar is required"}),
});
