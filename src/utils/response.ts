export const SuccessResponse = ({
  message = 'Successfully completed the request',
  data = {},
}) => ({
  success: true,
  message,
  data,
});

export const ErrorResponse = ({
  message = 'Something went wrong',
  error = {},
}) => ({
  success: false,
  message,
  error,
});
