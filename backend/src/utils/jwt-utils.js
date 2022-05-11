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
  console.log(userId);
  return jwt.sign({username, userId, role}, SECRET, { expiresIn: '1800m' });
}

export {
  getDataFromToken,
  generateAccessToken,
};
