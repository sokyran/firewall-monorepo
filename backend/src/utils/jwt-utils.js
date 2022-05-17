import jwt from 'jsonwebtoken';

const SECRET = process.env.SECRET;

const getDataFromToken = async (token) => {
  try {
    const data = await jwt.verify(token, SECRET);
    return data
  } catch {
    return null
  }
}

const generateAccessToken = (username, userId, role) => {
  return jwt.sign({username, userId, role}, SECRET);
}

const genereateCsrfToken = (userId) => {
  return jwt.sign({userId}, SECRET, { expiresIn: '20m' });
}

export {
  getDataFromToken,
  generateAccessToken,
  genereateCsrfToken,
};
