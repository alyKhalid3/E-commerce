import { Request } from 'express';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, Options } from "@nestjs/common";
import { filter, Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { IHydratedUser } from 'src/types/user.type';


export interface AuthRequest extends Request {
    user: IHydratedUser;
}

// export interface payload {
//     jti: string,
//     id: string,
//     iat: number,
//     exp: number
// }


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepo: UserRepo
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {



        try {
            const req: AuthRequest = context.switchToHttp().getRequest<AuthRequest>();
            const { authorization } = req.headers;

            if (!authorization || !authorization.startsWith('Bearer ')) {
                throw new BadRequestException('invalid token')
            }
            const token = authorization.split(' ')[1]
            if (!token) {
                throw new BadRequestException('invalid token')
            }
            
            const payload = this.jwtService.decode(token) 

            if (payload?.exp < Date.now() / 1000) {
                throw new BadRequestException('token expired')
            }
            const user = await this.userRepo.findById({
                id: payload.id.toString(),
                options: {
                    select: '-password -emailOtp -createdAt -updatedAt -__v'
                }
            }) as IHydratedUser
            if (!user) {
                throw new BadRequestException('invalid token')
            }
            if (!user.IsConfirmed) {
                throw new BadRequestException('user is not confirmed')
            }

            req.user = user
            return true
        } catch (error) {
            throw new BadRequestException('invalid token')
        }
    }


}
