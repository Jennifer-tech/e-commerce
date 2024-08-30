import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../types/user-request";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const adminMiddleware = async(req: UserRequest, res:Response, next: NextFunction) => {
   const user = req.user

   if(user?.role == 'ADMIN') {
    next()
   } else {
    next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
   }
}
export default adminMiddleware