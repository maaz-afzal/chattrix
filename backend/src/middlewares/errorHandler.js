import AppError from "../utils/AppError.js";

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let status = err.status || (statusCode >= 500 ? "error" : "fail");
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError" && err.errors) {
    statusCode = 400;
    status = "fail";
    const firstKey = Object.keys(err.errors)[0];
    message = err.errors[firstKey]?.message || "Validation failed";
  } else if (err.name === "CastError") {
    statusCode = 400;
    status = "fail";
    message = "Invalid ID provided";
  } else if (err.code === 11000) {
    statusCode = 409;
    status = "fail";
    message = "That value already exists. Please use a different one.";
  }

  if (process.env.NODE_ENV === "production") {
    if (statusCode >= 500) {
      console.error("ERROR 💥", err);
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    } else {
      res.status(statusCode).json({ status, message });
    }
  } else {
    res.status(statusCode).json({
      status,
      message,
      stack: err.stack,
      error: err,
    });
  }
};