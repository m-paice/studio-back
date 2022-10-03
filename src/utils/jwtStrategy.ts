import jwt from 'jsonwebtoken';

export const generateToken = (data: { id: string }) => {
  const token = jwt.sign(data, process.env.VERIFY_TOKEN);

  return token;
};

export const verifyToken = () => {};
