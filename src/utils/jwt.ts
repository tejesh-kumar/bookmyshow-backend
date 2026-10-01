const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET;
const options = { expiresIn: '10m' }; // Token expires in 10 min

const generateJwtToken = (payload: unknown) =>
  jwt.sign(payload, secretKey, options);

const verifyJwtTokenAndGetUser = (token: string) => {
  try {
    const payload = jwt.verify(token, secretKey);
    // console.log('Decoded Payload:', payload);
    return { payload, isValidToken: true };
  } catch (error) {
    console.error('Invalid token:', error);
    return { error, isValidToken: false };
  }
};

export { generateJwtToken, verifyJwtTokenAndGetUser };
