import { FlattenMaps, HydratedDocument, Model, QueryOptions } from "mongoose";

import { IUser } from "src/types/user.type";
import { DBRepo } from "./DBRepo";
import { User, UserModel } from "src/models/user.model";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepo extends DBRepo<IUser> {
    constructor( @InjectModel(User.name) protected override readonly model: Model<IUser>) {
        super(model);
    }
    findByEmail=async({email,projection,options}:{email:string,projection?:string,options?:QueryOptions<IUser>}):Promise<FlattenMaps<HydratedDocument<IUser>>|HydratedDocument<IUser>|null>=>{
        const query= this.model.findOne({email},projection,options)
        if(options?.lean){
            query.lean(true)
        }
        const doc=query.exec()
        return doc
    }
}