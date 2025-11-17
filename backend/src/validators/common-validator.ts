import path from 'path';

const mimeToExtension = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
} as const;

export const generateFileValidator =
  (mimetypes: (keyof typeof mimeToExtension)[], filesize: number) =>
  (file: Express.Multer.File) => {
    if (!mimetypes.includes(file.mimetype as keyof typeof mimeToExtension))
      throw new Error('Invalid file type');

    const ext = mimeToExtension[file.mimetype as keyof typeof mimeToExtension];
    const fileExt = path.extname(file.originalname).toLowerCase().substring(1);
    if (ext !== fileExt) throw new Error('File extension does not match MIME type');

    const maxSizeInBytes = filesize * 1024 * 1024;
    if (file.size > maxSizeInBytes) throw new Error('File size exceeds limit');
  };
export type FileValidator = ReturnType<typeof generateFileValidator>;
