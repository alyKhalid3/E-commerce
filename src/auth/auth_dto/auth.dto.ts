
import { changePasswordSchema, confirmEmailSchema, forgetPasswordSchema, loginSchema, signUpSchema } from '../authValidation/auth.zod';
import z from 'zod';





export type signUpDto = z.infer<typeof signUpSchema> & {firstName:string,lastName:string}
export type loginDto = z.infer<typeof loginSchema> 
export type confirmEmailDto = z.infer<typeof confirmEmailSchema>
export type forgetPasswordDto = z.infer<typeof forgetPasswordSchema>
export type changePasswordDto = z.infer<typeof changePasswordSchema>