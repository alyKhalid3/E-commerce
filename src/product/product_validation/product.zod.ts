
import z from "zod";





export const createProductSchema = z.strictObject({
    name: z.string().min(3),
    description: z.string().min(3),
    // images: z.array(z.file()),
    originalPrice: z.string().min(1),
    discount: z.string().min(1),
    stock: z.string().min(1),
    category: z.string().min(24),
    brand: z.string().min(24),
    
    
})