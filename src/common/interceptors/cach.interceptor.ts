import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, of, tap } from 'rxjs';
import { AuthRequest } from '../guards/auth.guard';
import type { RedisClientType } from 'redis';

@Injectable()
export class cachInterceptor implements NestInterceptor {
  constructor(
    @Inject('REDIS_CLIENT') private readonly radisClient: RedisClientType,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    if (req.method != 'GET') {
        return next.handle();
    }
    const key = await this.generateKey(req);
    const data = await this.radisClient.get(key);
    if (data) {
      console.log('data from cache');

      return of(JSON.parse(data));
    }
    return next.handle().pipe(
      tap(async (resData) => {
        console.log(resData);
        const value =
          typeof resData === 'string' ? resData : JSON.stringify(resData);
        if (!this.radisClient.isOpen) {
          this.radisClient.connect();
        }
        await this.radisClient.set(key, value, {
          expiration: {
            type: 'EX',
            value: 60,
          },
        })

        console.log('data saved to cache');
        
      }),
    );
  }

  async generateKey(req: AuthRequest) {
    const url = req.path;
    const queryPart = Object.keys(req.query || {}).length
      ? `?${JSON.stringify(req.query)}`
      : '';
    const userPart = req.user?._id ? `u${JSON.stringify(req.user?._id)}` : '';
    const key = `http-cache:${req.method}:${url}${queryPart}${userPart}`;
    return key;
  }
}
