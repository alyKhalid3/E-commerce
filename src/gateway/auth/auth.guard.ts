import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRepo } from 'src/Repos/user.repo';
import { Socket } from 'socket.io';
import { IHydratedUser, IUser } from 'src/types/user.type';

export interface socketWithUser extends Socket {
  user: IUser;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient<Socket>();

    const authHeaders = client.handshake.headers.authorization as string;
    if (!authHeaders) throw new UnauthorizedException('Missing auth headers');
    const payload = this.jwtService.verify(authHeaders, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    const user = await this.userRepo.findById({
      id: payload.id,
      options: {
        select: '-password -emailOtp -passwordOtp -createdAt -updatedAt -__v',
      },
    });
    if (!user) throw new NotFoundException('user not found');
    (client as socketWithUser).user = user;
    return true;
  }
}
