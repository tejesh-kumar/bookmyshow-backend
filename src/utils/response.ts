export const SuccessResponse = ({
  message = 'Successfully completed the request',
  response = {},
}) => ({
  success: true,
  message,
  response,
});

export const ErrorResponse = ({
  message = 'Something went wrong',
  error = {},
}) => ({
  success: false,
  message,
  error,
});
