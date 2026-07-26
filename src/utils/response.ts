export const SuccessResponse = ({
  message = 'Successfully completed the request',
  data = {},
  metaData = {},
}) => ({
  success: true,
  message,
  data,
  metaData,
});

export const ErrorResponse = ({
  message = 'Something went wrong',
  error = {},
}) => ({
  success: false,
  message,
  error,
});
