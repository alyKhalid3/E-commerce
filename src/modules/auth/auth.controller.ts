import { BadRequestException, Body, Controller, Get, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { changePasswordDto, confirmEmailDto, confirmUpdateEmailotp, loginDto, resendEmailOtpDto, signUpDto, updateInfoDto, updatePasswordDto } from "./auth_dto/auth.dto";
import { CheckPasswordPipe } from "src/common/pipes/checkPassword.pipe";
import { ZodValidationPipe } from "src/common/pipes/zod.pipe";
import { changePasswordSchema, confirmEmailSchema, confirmUpdateEmailSchema, forgetPasswordSchema, loginSchema, resendEmailOtpSchema, signUpSchema, updateInfoSchema, updatePasswordSchema } from "./authValidation/auth.zod";
import { AuthGuard, type AuthRequest } from "src/common/guards/auth.guard";
import { LoggerInterceptor } from "src/common/interceptors/logger.interceptor";


@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) { }



   @Post('signup')
   @UsePipes(new ZodValidationPipe(signUpSchema))
   async signUp(@Body() data: signUpDto) {
      return { data: await this.authService.signup(data) }
   }
   @Post('signup/gmail')
   async signUpGmail(@Body() data: string) {
      return { data: await this.authService.signupGmail(data) }
   }
   @Post('login/gmail')
   async loginWithGmail(@Body() data: string) {
      return { data: await this.authService.loginWithGmail(data) }
   }
   @Post('confirm-email')
   @UsePipes(new ZodValidationPipe(confirmEmailSchema))
   async confirmEmail(@Body() data: confirmEmailDto) {
      return {
         data: await this.authService.confirmEmail(data),
      }
   }

   @Post('resend-email-otp')
   @UsePipes(new ZodValidationPipe(resendEmailOtpSchema))
   async resendEmailOtp(@Body() data: resendEmailOtpDto) {
      return await this.authService.resendEmailOtp(data)
   }

   @Post('login')
   @UsePipes(new ZodValidationPipe(loginSchema))
   async login(@Body() data: loginDto) {
      return await this.authService.login(data)
   }

   @Post('forget-password')
   @UsePipes(new ZodValidationPipe(forgetPasswordSchema))
   async forgetPassword(@Body() data: confirmEmailDto) {

      return {
         data: await this.authService.forgetPassword(data),
         message: 'code sent successfully'
      }
   }

   @Patch('change-password')
   @UsePipes(new ZodValidationPipe(changePasswordSchema))
   async changePassword(@Body() data: changePasswordDto) {

      return {
         data: await this.authService.changePassword(data),
         message: 'password changed successfully'
      }
   }

   @Patch('update-password')
   @UseGuards(AuthGuard)
   @UsePipes(new ZodValidationPipe(updatePasswordSchema))
   async updatePassword(@Body() data: updatePasswordDto, @Req() req: AuthRequest) {
      const userId = req.user.id


      return await this.authService.updatePassword(data, userId)
   }
   @Patch('update-info')
   @UseGuards(AuthGuard)
   @UsePipes(new ZodValidationPipe(updateInfoSchema))
   async updateInfo(@Body() data: updateInfoDto, @Req() req: AuthRequest) {
      const user = req.user
      return await this.authService.updateInfo(data, user)
   }
   @Patch('update-email')
   @UseGuards(AuthGuard)
   @UsePipes(new ZodValidationPipe(resendEmailOtpSchema))
   async updateEmail(@Body() data: resendEmailOtpDto, @Req() req: AuthRequest) {
       const userId =req.user.id
       return await this.authService.updateEmail(data,userId)
   }

   @Patch('confirm-update-email')
   @UsePipes(new ZodValidationPipe(confirmUpdateEmailSchema))
   async confirmUpdateEmail(@Body() data: confirmUpdateEmailotp) {
       return await this.authService.confirmUpdateEmail(data)
   }

   @Post('me')
   @UseGuards(AuthGuard)
   //  @UseInterceptors(LoggerInterceptor)
   async test(@Req() req: AuthRequest) {
      return {
         data: req.user,
         statusCode: 200,
         message: 'success'
      }
   }
}
