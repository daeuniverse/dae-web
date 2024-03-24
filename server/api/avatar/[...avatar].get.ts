import fs from 'node:fs'
import path from 'node:path'
import { resolveAvatarDataPath } from '~/utils/path.server'

export default defineEventHandler((event) => {
  const avatar = event.context.params?.avatar
  if (!avatar) return

  return sendStream(
    event,
    fs.createReadStream(path.join(resolveAvatarDataPath(), avatar))
  )
})
