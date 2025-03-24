import { z } from "zod"

export const newCredToken = z.object({
    token: z.string().min(1, "Please Provide Token for totp."),
    title: z.string().min(1, "Please Provide Title for totp."),
    description: z.string().min(1, "Please Provide description for totp.")
})


