import z from 'zod';

export const registerValidator = z.object({
  name: z
    .string()
    .min(3, { message: 'Nama minimal 3 karakter' })
    .max(100, { message: 'Nama maksimal 100 karakter' }),
  email: z.email({ message: 'Email tidak valid' }),
  password: z
    .string()
    .min(6, { message: 'Kata sandi minimal 6 karakter' })
    .max(100, { message: 'Kata sandi maksimal 100 karakter' }),
});

export const loginValidator = z.object({
  email: z.email({ message: 'Email tidak valid' }),
  password: z.string().min(1, { message: 'Kata sandi wajib diisi' }),
});

export type RegisterValidator = z.infer<typeof registerValidator>;
export type LoginValidator = z.infer<typeof loginValidator>;
