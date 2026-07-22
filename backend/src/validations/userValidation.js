import { body } from "express-validator";

export const validateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 50 characters."),
  body("bio")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Bio cannot exceed 100 characters."),
  body("profileImage")
    .optional()
    .isString()
    .withMessage("Invalid profile image URL."),
];