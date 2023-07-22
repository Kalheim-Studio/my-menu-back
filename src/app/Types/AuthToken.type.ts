import { JwtPayload } from "jsonwebtoken";

interface AuthToken extends JwtPayload {
  restaurantId: string;
  role: string,
  iat: number;
  exp: number;
}

export { AuthToken };
