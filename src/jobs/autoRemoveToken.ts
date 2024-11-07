// Tạo một cron job chạy mỗi giờ
import { Cron } from 'croner'
import { AppDataSource } from '@/config/database'
import { TokenUser } from '@/models/TokenUser'

const autoRemoveTokenJob = () => {
  new Cron('0 * * * *', async () => {
    console.log('Running cron job to clean up expired tokens...')

    try {
      const tokenRepository = AppDataSource.getRepository(TokenUser)

      // Xóa các token đã hết hạn
      await tokenRepository
        .createQueryBuilder()
        .delete()
        .from(TokenUser)
        .where('expired < :now', { now: new Date() })
        .execute()

      console.log('Expired tokens have been cleaned up successfully.')
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error)
    }
  })
}

export default autoRemoveTokenJob
