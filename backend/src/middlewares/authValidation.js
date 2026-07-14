import { body, validationResult } from "express-validator";

export const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

export const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters."),
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

export const validateLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please enter a valid email."),
  body("password").notEmpty().withMessage("Password is required."),
];
