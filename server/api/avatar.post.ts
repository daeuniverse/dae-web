import fsPromise from 'node:fs/promises'
import path from 'node:path'
import { resolveAvatarDataPath } from '~/utils/path.server'

export default defineEventHandler(async (event) => {
  const body = await readFormData(event)
  const avatar = body.get('avatar') as File
  const avatarPath = path.join(resolveAvatarDataPath(), avatar.name)

  await fsPromise.writeFile(avatarPath, Buffer.from(await avatar.arrayBuffer()))

  return `/api/avatar/${avatar.name}`
})
