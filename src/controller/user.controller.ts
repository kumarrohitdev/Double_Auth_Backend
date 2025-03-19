import { Request, Response } from "express";
import { userValidator } from "../validator/user.validator";
import prisma from "../Database";

export const registerUser = async (req: Request, res: Response):Promise<any> => {
    try {
        const isValidated = userValidator.safeParse(req.body);

        if (!isValidated.success) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: isValidated.error.format(),
            });
        }


        const isUser = await prisma.user.findFirst({
            where: { phone: req.body.phone } 
        });

        if (isUser) {
            return res.status(409).json({
                status: false,
                message: "User already exists!",
            });
        }

        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                image: req.body.image
            }
        });

        return res.status(201).json({
            status: true,
            message: "User registered successfully",
            data: newUser,
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
