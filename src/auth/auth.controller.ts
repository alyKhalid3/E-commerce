import { BadRequestException, Body, Controller, Get, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import type { changePasswordDto, confirmEmailDto, loginDto, signUpDto } from "./auth_dto/auth.dto";
import { CheckPasswordPipe } from "src/common/pipes/checkPassword.pipe";
import { ZodValidationPipe } from "src/common/pipes/zod.pipe";
import { changePasswordSchema, confirmEmailSchema, forgetPasswordSchema, loginSchema, signUpSchema } from "./authValidation/auth.zod";
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


   @Post('login')
   @UsePipes(new ZodValidationPipe(loginSchema))
   async login(@Body() data: loginDto) {
      return await this.authService.login(data)
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
