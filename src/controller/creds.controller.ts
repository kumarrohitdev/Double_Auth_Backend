import { Request, Response } from "express";
import { newCredToken } from "../validator/creds.validator";
import prisma from "../Database";

export const saveNewToken = async (res: Response, req: Request) => {
    try {
        const isValidated = newCredToken.safeParse(req.body)
        if (!isValidated.success) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: isValidated.error.format(),
            });
        }

        //checking is title allready exist or not
        const isTitleExist = await prisma.tokens.findFirst({
            where: { title: isValidated.data.title }
        })

        if (isTitleExist) {
            return res.status(400).json({
                status: false,
                message: "Token already exists with this title."
            })
        }
        //saving the data into database
        await prisma.tokens.create({
            data: {
                title: isValidated.data.title,
                token: isValidated.data.title,
                description: isValidated.data.description,
                userId: req.body.user.id
            }
        })

        return res.status(200).json({
            status: true,
            message: "successfully saved provided token."
        })

    } catch (error) {

    }
}