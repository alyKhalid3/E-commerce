
import { hash, compare } from 'bcrypt'

export const createHash = async (text: string): Promise<string> => {
    return await hash(text, +(process.env.SALT_ROUNDS as string));
}



export const compareHash = async (text: string, hash: string): Promise<boolean> => {
    return await compare(text, hash);
}