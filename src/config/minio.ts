import * as Minio from 'minio'

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
      console.log('Bucket created successfully in "us-east-1".')
    }
  } catch (err) {
    console.error('Error creating bucket:', err)
  }
}

export const getPresignedUrl = async (fileName: string, bucketName: string) => {
  try {
    const url = await minioClient.presignedUrl('GET', bucketName, fileName, 24 * 60 * 60) // URL có thời hạn 24 giờ
    return url
  } catch (error) {
    console.error('Lỗi khi tạo URL tạm thời:', error)
    throw error
  }
}
