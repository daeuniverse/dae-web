import fs from 'node:fs'
import path from 'node:path'
import { resolveAvatarDataPath } from '~/utils/path.server'

// 获取头像文件流
export default defineEventHandler((event) => {
  const avatar = event.context.params?.avatar
  if (!avatar) return

  return sendStream(
    event,
    fs.createReadStream(path.join(resolveAvatarDataPath(), avatar))
  )
})
