import { Request, Response } from "express";
import { loginValidator, userValidator } from "../validator/user.validator";
import prisma from "../Database";
import argon2 from "argon2"
import jwt from "jsonwebtoken"

export const registerUser = async (req: Request, res: Response): Promise<any> => {
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
        req.body.password = await argon2.hash(req.body.password)
        const newUser = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                image: req.body.image,
                password: req.body.password
            }
        });

        return res.status(201).json({
            status: true,
            message: "User registered successfully",
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { phone, password } = req.body;

        const isValidated = loginValidator.safeParse(req.body)
        if (!isValidated.success) {
            return res.status(400).json({
                status: false,
                message: "Validation failed",
                errors: isValidated.error.format(),
            });
        }

        const user = await prisma.user.findFirst({
            where: { phone }
        });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                userId: user.id,
                phone: user.phone
            },
            process.env.JWT_SECRET || "",
            { expiresIn: "24h" }
        );

        return res.status(200).json({
            status: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    image: user.image
                }
            }
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: "Internal server error",
            error: error.message
        });
    }
}