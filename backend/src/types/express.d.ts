import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
  };
}

// import { Request } from "express";

// declare module "express" {
//   export interface Request {
//     user?: {
//       userId: number;
//     };
//   }
// }
