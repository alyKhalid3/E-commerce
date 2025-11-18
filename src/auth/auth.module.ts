import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModel } from "src/models/user.model";
import { UserRepo } from "src/Repos/user.repo";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";


@Module({
  imports: [UserModel],
  controllers: [AuthController],
  providers: [AuthService,UserRepo,JwtService,OAuth2Client],
})


export class AuthModule {}