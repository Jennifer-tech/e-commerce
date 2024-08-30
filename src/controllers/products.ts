import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async(req:Request, res: Response) => {
    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })
    res.json(product)
}

export const updateProduct = async(req: Request, res: Response) => {
    try{
        const product = req.body;
        if(product.tags) {
            product.tags = product.tags.join(',')
        }

        const updateProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id  //the + sign was added because id is of type number in the database
            },
            data: product
        })
        res.json(updateProduct)
    } catch (err) {
        throw new NotFoundException('Product not found, ', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async(req: Request, res: Response) => {
    try{
        const deleteProduct = await prismaClient.product.delete({
            where: {
                id: +req.params.id
            }
        })
        res.json('Product deleted successfully')
    } catch (err) {
        throw new NotFoundException('Product not found, ', ErrorCode.PRODUCT_NOT_FOUND)
    }
}

export const listProducts = async(req: Request, res: Response) => {
    const count = await prismaClient.product.count()

    const skip = req.query.skip ? parseInt(req.query.skip as string, 10) : 0;
    const products = await prismaClient.product.findMany({
        skip: isNaN(skip) ? 0 : skip,
        take: 5
    })
    res.json({
        count,
        data: products
    })
}

export const getProductById = async(req: Request, res: Response) => {
    try{
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: +req.params.id
            }
        })
        res.json(product)
    } catch (err) {
        throw new NotFoundException('Product not found', ErrorCode.PRODUCT_NOT_FOUND)
    }
}