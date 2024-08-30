import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import { UserRequest } from "../types/user-request";

const authMiddleware = async(req: UserRequest, res:Response, next: NextFunction) => {
    // 1. extract the token from the header
    const token = req.headers.authorization
    // 2. If token is not present, throw an error of unauthorized
    if(!token) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
    try{
        // 3. If the token is present, verify that token and extract the payload
        const payload = jwt.verify(token!, JWT_SECRET) as any
        // 4. To get the user from the payload
        const user: User | null = await prismaClient.user.findFirst({where: {id: payload.userId}})

        if(!user) {
            next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
        }
        // 5. attach the user to the current request object
        req.user = user!
        next()
    } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED))
    }
}
export default authMiddleware