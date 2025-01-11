import { User } from "@prisma/client";

export type VerifyTokenReponse =
    | {
          success: true;
          message: "string";
          user: User & {
              exp: number;
              iat: number;
          };
      }
    | {
          success: false;
          message: "string";
      };
