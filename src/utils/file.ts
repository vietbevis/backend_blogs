import fs from 'fs'
import path from 'path'

export const UPLOAD_TEMP_DIR = 'uploads'
export const UPLOAD_TEMP_DIR_OPTIMIZE = 'uploads/optimized'

export const initFolder = () => {
  const uploadFolderPath = path.resolve(UPLOAD_TEMP_DIR)
  const optimizeFolderPath = path.resolve(UPLOAD_TEMP_DIR_OPTIMIZE)
  if (!fs.existsSync(uploadFolderPath)) {
    fs.mkdirSync(uploadFolderPath, { recursive: true })
    console.log('Created: ' + uploadFolderPath)
  }
  if (!fs.existsSync(optimizeFolderPath)) {
    fs.mkdirSync(optimizeFolderPath, { recursive: true })
    console.log('Created: ' + optimizeFolderPath)
  }
}
