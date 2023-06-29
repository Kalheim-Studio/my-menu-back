import { JwtPayload } from "jsonwebtoken";

interface AuthToken extends JwtPayload {
  restaurantId: string;
  iat: number;
  exp: number;
}

export { AuthToken };
