import envPaths from 'env-paths'
import fs from 'node:fs/promises'
import { defineNuxtModule } from 'nuxt/kit'
import { resolveAvatarDataPath } from '../utils/path.server'

export default defineNuxtModule({
  async setup() {
    const { data } = envPaths('daed')

    await fs.mkdir(data, { recursive: true })
    await fs.mkdir(resolveAvatarDataPath(), { recursive: true })
  }
})
