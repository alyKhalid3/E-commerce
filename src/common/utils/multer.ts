import { diskStorage } from "multer"
import path from "path"
import fs from "fs"


export const multerOptions = (destination:string) => {

    return diskStorage({
        destination: (req, file, cb) => {
            const uploadPath=path.join(process.cwd(),destination)
            if(!fs.existsSync(uploadPath)){
                fs.mkdirSync(uploadPath,{recursive:true})
            }
            cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + file.originalname
            cb(null, uniqueSuffix)
        }

    })

}