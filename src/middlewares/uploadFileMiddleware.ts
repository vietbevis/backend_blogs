import multer from 'multer'
import path from 'path'
import { randomUUID } from 'crypto'
import { UPLOAD_TEMP_DIR } from '@/utils/file'
import { BadRequestError } from '@/core/ErrorResponse'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_TEMP_DIR) // Thư mục tạm lưu file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = randomUUID().replace(/-/g, '')
    cb(null, uniqueSuffix + '.webp')
  }
})
const uploadFileMiddleware = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (!(mimetype && extname)) {
      cb(new BadRequestError('File upload only supports the following filetypes - ' + filetypes))
    } else {
      return cb(null, true)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
})

export default uploadFileMiddleware
