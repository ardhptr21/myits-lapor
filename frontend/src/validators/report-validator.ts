import z from 'zod';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

export const reportCreateValidator = z.object({
  title: z
    .string()
    .min(3, { message: 'Judul minimal 3 karakter' })
    .max(200, { message: 'Judul maksimal 200 karakter' }),
  location: z
    .string()
    .min(3, { message: 'Lokasi minimal 3 karakter' })
    .max(200, { message: 'Lokasi maksimal 200 karakter' }),
  priority: z.enum(['low', 'medium', 'high']),
  photos: z
    .array(
      z
        .instanceof(File)
        .refine((f) => f.size <= MAX_PHOTO_SIZE, { message: 'Ukuran file maksimal 5MB' })
    )
    .min(1, { message: 'Tambahkan minimal 1 foto' })
    .max(5, { message: 'Maksimum 5 foto' }),
});

export type ReportCreateValidator = z.infer<typeof reportCreateValidator>;

export default reportCreateValidator;
