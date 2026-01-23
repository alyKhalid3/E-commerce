
import { GenderEnum, ProviderEnum, RolesEnum } from "src/types/user.type"
import { email, number, object, z } from "zod"



export const signUpSchema = z.strictObject({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    age: z.number().optional(),
    phone: z.string().optional(),
    gender: z.enum(Object.values(GenderEnum)).default(GenderEnum.MALE).optional(),
    role: z.enum(Object.values(RolesEnum)).default(RolesEnum.USER).optional(),
    provider: z.enum(Object.values(ProviderEnum)).default(ProviderEnum.SYSTEM).optional()

}).superRefine(({ username,password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"]
        })
    }
    if(username?.split(" ").length < 2) {
        ctx.addIssue({
            code: "custom",
            message: "Username should be at least 2 words separated by a space",
            path: ["username"]
        })
    }
})



export const loginSchema = z.strictObject({
    email: z.email(),
    password: z.string().min(6)
})

export const confirmEmailSchema = z.strictObject({
    email: z.email(),
    otp: z.string().min(6)
})

export const forgetPasswordSchema = z.strictObject({
    email: z.email(),
})



export const changePasswordSchema=z.strictObject({
    password: z.string().min(6),
    email : z.email(),
    otp: z.string().min(6)
})

export const resendEmailOtpSchema = z.strictObject({
    email: z.email(),
})


export const updatePasswordSchema = z.strictObject({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
}).superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword"]
        })
    }
})


export const updateInfoSchema=z.strictObject({
    username:z.string().min(1).optional(),
    phone:z.string().min(11).optional(),
    gender:z.enum(Object.values(GenderEnum)).default(GenderEnum.MALE).optional(),
    age:z.number().min(10).max(100).optional()
})

export const confirmUpdateEmailSchema=z.strictObject({
    email:z.email(),
    newOtp:z.string().min(6),
    oldOtp:z.string().min(6)

})