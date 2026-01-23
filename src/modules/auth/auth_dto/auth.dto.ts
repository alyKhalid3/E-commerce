
import { changePasswordSchema, confirmEmailSchema, confirmUpdateEmailSchema, forgetPasswordSchema, loginSchema, resendEmailOtpSchema, signUpSchema, updateInfoSchema, updatePasswordSchema } from '../authValidation/auth.zod';
import z from 'zod';





export type signUpDto = z.infer<typeof signUpSchema> & {firstName:string,lastName:string}
export type loginDto = z.infer<typeof loginSchema> 
export type confirmEmailDto = z.infer<typeof confirmEmailSchema>
export type forgetPasswordDto = z.infer<typeof forgetPasswordSchema>
export type changePasswordDto = z.infer<typeof changePasswordSchema>
export type resendEmailOtpDto = z.infer<typeof resendEmailOtpSchema>
export type updatePasswordDto = z.infer<typeof updatePasswordSchema>
export type updateInfoDto = z.infer<typeof updateInfoSchema>
export type confirmUpdateEmailotp=z.infer<typeof confirmUpdateEmailSchema>