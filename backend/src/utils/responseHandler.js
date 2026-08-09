export const sendResponse = (res, statusCode, data, message = "Success") => {
  const response = {
    status: "success",
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};