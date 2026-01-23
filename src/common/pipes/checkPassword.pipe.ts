import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { signUpDto } from "src/modules/auth/auth_dto/auth.dto";






@Injectable()
export class CheckPasswordPipe implements PipeTransform {
        transform(value: signUpDto, metadata: ArgumentMetadata) {
            if(value.password !== value.confirmPassword) {
                throw new Error('Passwords do not match')
            }
            return value
        }
}