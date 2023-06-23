import jwt from "jsonwebtoken";

/**
 * Warning: Only use this only if the auth cookie has already been verified.
 * The verification can be from the validateAuthCookie middleware
 * Or you may use the validateAndDecodeAuthToken which validates the auth token first.
 * @param {string} authCookie
 */

export function decodeAuthToken(authCookie) {
  return jwt.decode(authCookie);
}

export function validateAndDecodeAuthToken(authCookie) {
  try {
    return jwt.verify(authCookie, process.env.TOKEN_SALT);
  } catch (error) {
    console.error(error);
    throw new Error("Can't validate and decode the auth token.");
  }
}
