
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { UserRepo } from 'src/Repos/user.repo';
import { AuthGuard, socketWithUser } from '../auth/auth.guard';

@WebSocketGateway({ namespace: 'public', cors: { origin: '*' } })
export class RealTimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepo: UserRepo,
  ) {}
  async handleConnection(client: Socket) {
    // const token = client.handshake.headers.authorization as string;
    // if(!token) throw new Error('token not found')
    // const payload = await this.jwtService.verify(token ,{
    //     secret: process.env.ACCESS_TOKEN_SECRET,
    // });
    // const user=await this.userRepo.findById({id:payload.id})
    console.log('connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('disconnected:', client.id);
  }

  @UseGuards(AuthGuard)
  @SubscribeMessage('sayHi')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
    console.log(data,(socket as socketWithUser).user);
    socket.emit('sayHi', 'recieved');
    return data;
  }
}
