

import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { createHash } from "src/common/utils/hash";
import { emailEmitter } from "src/common/utils/sendEmail/emailEvents";
import { template } from "src/common/utils/sendEmail/generateHTML";
import { GenderEnum, type IOtp, IUser, ProviderEnum, RolesEnum } from "src/types/user.type";


@Schema({ _id: false })
export class OtpSchema {
    @Prop({
        type: String
    })
    otp: string;

    @Prop({
        type: Date
    })
    expiredAt: Date
}


@Schema({
    timestamps: true
})
export class User implements IUser {
    @Prop({
        type: String,
        required: true,
        min: [3, "First name should be at least 3 characters long"]
    })
    firstName: string;
    @Prop({
        type: String,
        required: true,
        min: [3, "First name should be at least 3 characters long"]
    })
    lastName: string;
    @Prop(({
        type: String,
        get: function () {
            return `${this.firstName} ${this.lastName}`;
        },
        set: function (value) {
            const names = value.split(" ");
            this.firstName = names[0];
            this.lastName = names[1];
            
        }

    }))
    username: string;
    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string;
    @Prop({
        type: String,
        required: function () {
            return this.provider === ProviderEnum.SYSTEM
        },
        // set: async function (value) {
        //     this.password = await createHash(value);
        // }
    })
    password: string;
    @Prop({
        type: Number
    })
    age: number;
    @Prop({
        type: Date
    })
    credantialsChangedAt: Date;
    @Prop({
        type: {
            otp: String,
            expiredAt: Date
        }
    })
    emailOtp: IOtp;
    @Prop({
        type: {
            otp: String,
            expiredAt: Date
        }
    })
    newEmailOtp: IOtp
    @Prop({
        type:String
    })
    newEmail:string
    @Prop({
        type: Boolean,
        default: function () {
            return this.provider === ProviderEnum.GOOGLE
        }
    })
    IsConfirmed: boolean;
    @Prop({
        type: OtpSchema
    })
    passwordOtp: IOtp;
    @Prop({
        type: String,
        enum: Object.values(GenderEnum),
        default: GenderEnum.MALE
    })
    gender: GenderEnum;
    @Prop({
        type: String
    })
    phone: string;
    @Prop({
        type: String,
        enum: Object.values(ProviderEnum),
        default: ProviderEnum.SYSTEM
    })
    provider: ProviderEnum;
    @Prop({
        type: String,
        enum: Object.values(RolesEnum),
        default: RolesEnum.USER
    })
    role: RolesEnum;
    @Prop({
        type: String
    })
    picture: string
}

const UserSchema = SchemaFactory.createForClass(User);
export { UserSchema };
UserSchema.set('toJSON', { getters: true, virtuals: true });
UserSchema.set('toObject', { getters: true, virtuals: true });

UserSchema.pre('save', async function (this: HydratedDocument<IUser> & { firstCreation: boolean, plainTextOtp?: string }, next) {
    this.firstCreation = this.isNew
    this.plainTextOtp = this.emailOtp?.otp as string
    if (this.isModified('password'))
        this.password = await createHash(this.password)
    if (this.isModified('emailOtp'))
        this.emailOtp.otp = await createHash(this.emailOtp.otp as string)
    next()
})
UserSchema.post('save', async function (doc, next) {

    const that = this as HydratedDocument<IUser> & { firstCreation: boolean, plainTextOtp?: string }
    if (that.firstCreation && !that.IsConfirmed) {
        const subject = 'email verification'
        const html = template({ code: that.plainTextOtp as string, name: `${doc.firstName} ${doc.lastName}`, subject })
        emailEmitter.publish('send-email-activation-code', { to: doc.email, subject, html })
    }
    next()

})


const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
export { UserModel }
