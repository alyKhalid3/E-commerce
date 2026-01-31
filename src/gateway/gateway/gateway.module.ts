import { Module } from '@nestjs/common';
import { RealTimeGateway } from './gateway';
import { JwtService } from '@nestjs/jwt';
import { UserRepo } from 'src/Repos/user.repo';
import { UserModel } from 'src/models/user.model';

@Module({
  imports: [UserModel],
  controllers: [],
  providers: [RealTimeGateway,JwtService,UserRepo],
})
export class GatewayModule {}
