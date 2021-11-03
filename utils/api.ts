import { getAPIClient } from "./axios";
import * as jwt from "jsonwebtoken";
import { parseCookies } from "nookies";

export const api = getAPIClient();

export function verifyToken() {
  const { ["kyoka-token"]: token } = parseCookies();

  const jwtData = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

  return jwtData["id"];
}
