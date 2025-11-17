import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { HTTPException } from '../exceptions/http-exception';
import { FileValidator } from '../validators/common-validator';

const BASE_FOLDER = path.join(__dirname, '../../uploads');

export const uploader = (folder: string = 'others', validator: FileValidator) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(BASE_FOLDER, folder);
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = String(Date.now()) + Math.round(Math.random() * 1e9);
      const basename = path.basename(file.originalname).toLowerCase();
      const filename = uniqueSuffix + '-' + basename;
      cb(null, filename);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      try {
        validator(file);
      } catch (err) {
        return cb(
          new HTTPException(400, 'Invalid file upload', {
            file: err instanceof Error ? err.message : 'Invalid file',
          })
        );
      }
      return cb(null, true);
    },
  });
};

export const removeFiles = (filepaths: string | string[]) => {
  const paths = Array.isArray(filepaths) ? filepaths : [filepaths];
  for (const filepath of paths) {
    const fullpath = path.join(__dirname, '../../', filepath);
    if (fs.existsSync(fullpath)) {
      fs.unlinkSync(fullpath);
    }
  }
};
