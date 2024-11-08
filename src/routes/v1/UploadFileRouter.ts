import express, { Request, Response } from 'express'
import uploadFileMiddleware from '@/middlewares/uploadFileMiddleware'
import { CreatedResponse } from '@/core/SuccessResponse'
import { BadRequestError, InternalServerError } from '@/core/ErrorResponse'
import asyncHandler from '@/middlewares/asyncHandler'
import path from 'path'
import sharp from 'sharp'
import { BUCKET_NAME, minioClient } from '@/config/minio'
import { UPLOAD_TEMP_DIR_OPTIMIZE } from '@/utils/file'
import fs from 'fs/promises'

const UploadFileRouter = express.Router()

interface ProcessedImage {
  fileSize: number
  filename: string
  mimetype: string
  originalname: string
}

async function processImage(file: Express.Multer.File): Promise<ProcessedImage> {
  const optimizedPath = path.join(UPLOAD_TEMP_DIR_OPTIMIZE, file.filename)

  try {
    // Tối ưu ảnh
    await sharp(file.path)
      .webp({ quality: 80, effort: 0 }) // Giảm chất lượng ảnh
      .toFile(optimizedPath)

    const originalStats = await fs.stat(file.path)
    const optimizedStats = await fs.stat(optimizedPath)

    const isOptimized = optimizedStats.size < originalStats.size

    // Upload file có kích thước nhỏ hơn
    if (isOptimized) {
      await minioClient.fPutObject(BUCKET_NAME, file.filename, optimizedPath)
    } else {
      await minioClient.fPutObject(BUCKET_NAME, file.filename, file.path)
    }

    // Xóa cả file gốc và file đã tối ưu
    await Promise.all([fs.unlink(file.path), fs.unlink(optimizedPath)])

    return {
      originalname: file.originalname,
      filename: file.filename,
      fileSize: file.size,
      mimetype: file.mimetype
    }
  } catch (error) {
    // Đảm bảo xóa files nếu có lỗi xảy ra
    await Promise.all([fs.unlink(file.path).catch(() => {}), fs.unlink(optimizedPath).catch(() => {})])
    throw error
  }
}

UploadFileRouter.post(
  '/',
  asyncHandler(uploadFileMiddleware.array('files', 10)),
  asyncHandler(async (req: Request, res: Response) => {
    const uploadedFiles = req.files as Express.Multer.File[]

    if (!uploadedFiles || uploadedFiles.length === 0) {
      throw new BadRequestError('No file uploaded')
    }

    try {
      const processedImages = await Promise.all(uploadedFiles.map(processImage))

      new CreatedResponse('Uploaded successfully', processedImages).send(res)
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new InternalServerError('Error uploading file.')
    }
  })
)

export default UploadFileRouter
