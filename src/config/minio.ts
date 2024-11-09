import * as Minio from 'minio'
import logger from '@/config/logger'

export const minioClient = new Minio.Client({
  endPoint: 'localhost',
  port: 9000,
  useSSL: false,
  accessKey: 'AolVheVUPXZTHPEslDSc',
  secretKey: 'lgPMwpKpkzHqDEb7W2f91uAFsuTdYsFAw4B1StT2'
})

export const BUCKET_NAME = 'images'

export const InitMinio = async () => {
  try {
    const bucketExists = await minioClient.bucketExists(BUCKET_NAME)
    if (!bucketExists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      logger.info('Bucket created successfully in "us-east-1".')
    }
  } catch (err) {
    logger.error('Error creating bucket:', err)
  }
}
