import { z } from "zod";

export const userValidator = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    image: z.string().optional()
});