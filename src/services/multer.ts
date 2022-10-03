import { Request } from 'express';

import multer from 'multer';

const storage = multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: any) {
    cb(null, 'uploads/');
  },
  filename(req: Request, file: Express.Multer.File, cb: any) {
    const uniqueSuffix = `${Date.now()}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const multerConfig = multer({ storage });

export default multerConfig;
