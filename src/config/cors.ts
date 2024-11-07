import envConfig from '@/config/envConfig'
import { ForbiddenError } from '@/core/ErrorResponse'

const WHITELIST_DOMAINS = ['http://localhost:5173', 'http://localhost:3000']

export const corsOptions: any = {
  origin: function (origin: any, callback: any) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    if (!origin && !envConfig.PRODUCTION) {
      return callback(null, true)
    }

    // Kiểm tra dem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new ForbiddenError(`${origin} not allowed by our CORS Policy.`))
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
}
