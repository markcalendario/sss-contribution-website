import jwt from "jsonwebtoken";

export function decodeAuthToken(authCookie) {
  return jwt.decode(authCookie);
}
