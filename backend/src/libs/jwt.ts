import jwt from 'jsonwebtoken';

export interface JwtPayload extends jwt.JwtPayload {
  sub: string;
  email: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'please_change_this_secret_key';

export const generateToken = (payload: JwtPayload) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '3d',
    issuer: 'myits-lapor',
  });
  return token;
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: 'myits-lapor',
  }) as JwtPayload;
  return decoded;
};
