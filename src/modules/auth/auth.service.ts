import { hash } from 'bcrypt';


import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserModel } from "src/models/user.model";
import {
  changePasswordDto,
  confirmEmailDto,
  confirmUpdateEmailotp,
  forgetPasswordDto,
  loginDto,
  resendEmailOtpDto,
  signUpDto,
  updateInfoDto,
  updatePasswordDto
} from "./auth_dto/auth.dto";
import { createOtp } from 'src/common/utils/sendEmail/createOtp';
import { UserRepo } from "src/Repos/user.repo";
import { compareHash, createHash } from "src/common/utils/hash";
import { JwtService } from "@nestjs/jwt";
import { OAuth2Client } from "google-auth-library";
import { IHydratedUser, ProviderEnum } from "src/types/user.type";
import { template } from "src/common/utils/sendEmail/generateHTML";
import { emailEmitter } from "src/common/utils/sendEmail/emailEvents";





@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userRepo: UserRepo,
    private jwtService: JwtService,

  ) {

  }

  async signup(data: signUpDto) {
    const IsEmailExists = await this.userModel.findOne({ email: data.email })
    if (IsEmailExists) throw new BadRequestException("Email already exists")
    const otp = createOtp()
    const user = await this.userRepo.create(
      {
        ...data,
        emailOtp: { otp, expiredAt: new Date(Date.now() + 5 * 60 * 1000) }
      }

    )
    return { user }

  }
  async confirmEmail(data: confirmEmailDto) {
    const { email, otp } = data
    const user = await this.userRepo.findByEmail({ email })
    if (!user) throw new BadRequestException("Email not found")
    if (user.emailOtp.expiredAt.getTime() <= Date.now()) throw new BadRequestException("Otp expired")
    if (!await compareHash({ text: otp, hash: user.emailOtp.otp })) throw new BadRequestException("Invalid otp")
    await this.userRepo.update({
      filter: {
        _id: user._id
      },
      data: {
        $set: {
          IsConfirmed: true
        },
        $unset: {
          emailOtp: 1
        }
      }
    })


  }
  async verifyGoogleAccount({ idToken }: { idToken: string }) {
    try {
      const client = new OAuth2Client(process.env.WEB_CLIENT_IDS?.split(',')[0]); // أو أول client_id
      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.WEB_CLIENT_IDS?.split(',')
      });

      const payload = ticket.getPayload();
      return payload;
    } catch (err) {
      console.error('Google verify error:', err);
      throw new BadRequestException('Invalid Google token');
    }
  }
  async signupGmail(data) {
    const { idToken } = data
    const payload = await this.verifyGoogleAccount({ idToken })
    const { name, picture, email, email_verified } = payload || {}
    console.log(payload);

    if (!email_verified) {
      throw new BadRequestException('email not verified')
    }
    const user = await this.userRepo.findByEmail({ email: email as string })
    if (user) {
      throw new BadRequestException('user already exists')
    }

    const newUser = await this.userModel.create({
      firstName: name?.split(' ')[0],
      lastName: name?.split(' ')[1],
      email,
      picture,
      IsConfirmed: email_verified,
      provider: ProviderEnum.GOOGLE
    })


    return { user: newUser }


  }
  async login(data: loginDto) {
    const { email, password } = data
    const user = await this.userRepo.findOne({ filter: { email, provider: ProviderEnum.SYSTEM } })
    if (!user || ! await compareHash({ text: password, hash: user.password })) throw new BadRequestException("invalid credentials")
    if (!user.IsConfirmed) throw new BadRequestException("email not confirmed")
    const accessToken = await this.jwtService.sign({ id: user._id }, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "2h"
    })
    const refreshToken = await this.jwtService.sign({ id: user._id }, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "7d"
    })
    return { data: { accessToken, refreshToken } }
  }

  async loginWithGmail(data) {
    const { idToken } = data
    const payload = await this.verifyGoogleAccount({ idToken })
    const { email, email_verified } = payload || {}
    console.log(payload);

    if (!email_verified) {
      throw new BadRequestException('email not verified')
    }
    const user = await this.userRepo.findOne({ filter: { email, provider: ProviderEnum.GOOGLE } })
    if (!user) {
      throw new BadRequestException('in-valid login data or in-valid provider')
    }

    const accessToken = await this.jwtService.sign({ id: user._id }, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: "2h"
    })
    const refreshToken = await this.jwtService.sign({ id: user._id }, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: "7d"
    })

    return { accessToken, refreshToken }

  }
  async forgetPassword(data: forgetPasswordDto) {
    const { email } = data
    const user = await this.userRepo.findByEmail({ email })
    if (!user) throw new BadRequestException("user not found")
    if (!user.IsConfirmed) throw new BadRequestException("email not confirmed")
    if (user.passwordOtp?.expiredAt?.getTime() >= Date.now()) {
      throw new BadRequestException('wait for 5 minutes')
    }
    const otp = createOtp()
    const subject = 'forget password'
    const html = template({ code: otp, name: user.firstName, subject })
    emailEmitter.publish('send-reset-password-code', { to: email, subject, html })
    await this.userRepo.update({ filter: { email }, data: { passwordOtp: { otp: await createHash(otp), expiredAt: new Date(Date.now() + (5 * 60 * 1000)) } } })
    return {
      message: "otp sent successfully"
    }
  }
  async changePassword(data: changePasswordDto) {
    const { email, otp, password } = data
    const user = await this.userRepo.findByEmail({ email })
    if (!user) throw new NotFoundException("user not found")
    if (!await compareHash({ text: otp, hash: user.passwordOtp.otp })) throw new BadRequestException("invalid otp")
    if (user.passwordOtp.expiredAt.getTime() <= Date.now()) throw new BadRequestException("otp expired")
    await this.userRepo.update({
      filter: { email },
      data: {
        password: await createHash(password),
        credantialsChangedAt: new Date(Date.now()),
      }
    }
    )
  }
  async resendEmailOtp(data: resendEmailOtpDto) {
    const { email } = data
    const user = await this.userRepo.findByEmail({ email })
    if (!user)
      throw new BadRequestException("user not found")
    if (user.IsConfirmed) throw new BadRequestException("email already confirmed")
    if (user.emailOtp?.expiredAt.getTime() >= Date.now())
      throw new BadRequestException("wait for 5 minutes")
    const otp = createOtp()
    const subject = 'email verification'
    const html = template({ code: otp, name: `${user.firstName} ${user.lastName}`, subject })
    emailEmitter.publish('send-email-activation-code', { to: user.email, subject, html })
    await this.userRepo.update({ filter: { email }, data: { emailOtp: { otp: await createHash(otp), expiredAt: new Date(Date.now() + (5 * 60 * 1000)) } } })
    return { message: "otp sent successfully" }
  }
  async updatePassword(data: updatePasswordDto, userId: string) {
    const { currentPassword, newPassword } = data

    const user = await this.userRepo.findById({
      id: userId
    })
    if (!user) throw new BadRequestException('user not found')
    const isMatch = await compareHash({ text: currentPassword, hash: user.password })
    if (!isMatch) throw new ConflictException('password is not correct')
    if (await compareHash({ text: newPassword, hash: user.password }))
      throw new BadRequestException('please enter new password')
    await user.updateOne({
      password: await createHash(newPassword),
      credantialsChangedAt: new Date(Date.now())
    })
    await user.save()
    return {
      message: "password updated successfully"
    }

  }

  async updateInfo(data: updateInfoDto, user: IHydratedUser) {
    const { username, phone, gender, age } = data
    user.username = username || user.username
    user.phone = phone || user.phone
    user.gender = gender || user.gender
    user.age = age || user.age
    await user.save()
    return {
      message: "Info updated successfully"
    }
  }

  async updateEmail(data: resendEmailOtpDto, userId: string) {
    const { email } = data
    const user = await this.userRepo.findById({ id: userId })
    if (!user) throw new BadRequestException('user not found')
    if (user.email === email) {
      throw new ConflictException('email is same')
    }
    const isExist = await this.userRepo.findByEmail({ email })
    if (isExist) {
      throw new BadRequestException('email is already exist')
    }
    const oldOtp = createOtp()
    user.emailOtp = {
      otp: oldOtp,
      expiredAt: new Date(Date.now() + (5 * 60 * 1000))
    }
    emailEmitter.publish('send-email-activation-code', { to: user.email, subject: 'update email', html: template({ code: oldOtp, name: user.firstName, subject: 'update email' }) })

    const newOtp = createOtp()
    user.newEmailOtp = {
      otp: await createHash(newOtp),
      expiredAt: new Date(Date.now() + (5 * 60 * 1000))
    }
    emailEmitter.publish('send-email-activation-code', { to: email, subject: 'confirm updated email', html: template({ code: newOtp, name: user.firstName, subject: 'confirm updated email' }) })
    user.newEmail = email
    await user.save()
    return {
      message: "codes sent successfully"
    }

  }

  async confirmUpdateEmail(data: confirmUpdateEmailotp) {
    const { email, oldOtp, newOtp } = data
    const user = await this.userRepo.findByEmail({ email })
    if (!user)
      throw new NotFoundException('user not found')
    if (user.emailOtp.expiredAt.getTime() <= Date.now() || user.newEmailOtp.expiredAt.getTime() <= Date.now())
      throw new BadRequestException('otp is expired')
    if (! await compareHash({ text: oldOtp, hash: user.emailOtp.otp }) || !compareHash({ text: newOtp, hash: user.newEmailOtp.otp }))
      throw new ConflictException('invalid otp')

    await user.updateOne({
      $set: {
        IsConfirmed: true,
        email: user.newEmail,
        credantialsChangedAt: new Date(Date.now())
      },
      $unset: {
        newEmailOtp: {},
        emailOtp: {},
        newEmail: {}
      }

    })
     return {
      message:"email updated successfully"
     }
  }
  
}