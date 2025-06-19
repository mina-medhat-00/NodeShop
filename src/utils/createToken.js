import jwt from "jsonwebtoken";

const createToken = (payload) =>
  jwt.sign({ userID: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

export default createToken;
