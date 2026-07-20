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