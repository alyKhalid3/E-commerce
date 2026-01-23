import { BadRequestException, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { RolesEnum } from "src/types/user.type";




export class RolesGurad implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest();
        if(!req.user) {
            throw new BadRequestException('Unauthorized')
        }
        if(req.user.role !== RolesEnum.ADMIN) {
            throw new BadRequestException('Unauthorized')
        }
        return true
    }

}