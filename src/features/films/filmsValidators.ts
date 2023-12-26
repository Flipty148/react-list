import {z} from 'zod';

export const filmCreateSchema = z.object({
    original_name: z.string().min(2).max(100),
    russian_name: z.string().min(2).max(100),
    year: z.string().min(4).max(4),
    actors: z.string().min(2).max(100)
})
