<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { z } from 'zod'

const apiStore = useAPIStore()

const isLoading = ref(false)

const schema = z.object({
  endpointURL: z.string().url(),
  username: z.string().min(4),
  password: z.string().min(8)
})

type Schema = z.output<typeof schema>

const state = reactive<Schema>({
  endpointURL: '',
  username: '',
  password: ''
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  isLoading.value = true

  const { endpointURL, username, password } = event.data
  apiStore.endpointURL = endpointURL

  try {
    const token = await apiStore.login(username, password)
    if (token) apiStore.token = token
    await navigateTo('/', { replace: true })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <UCard class="mx-auto max-w-screen-sm">
    <UForm :schema :state class="space-y-4" @submit="onSubmit">
      <!-- dae-wing 后端 API 地址 -->
      <UFormGroup label="Endpoint URL" name="endpointURL">
        <UInput
          v-model="state.endpointURL"
          class="w-full"
          type="url"
          icon="i-heroicons-cloud"
        />
      </UFormGroup>

      <!-- 用户名 -->
      <UFormGroup label="Username" name="username">
        <UInput
          v-model="state.username"
          class="w-full"
          type="text"
          icon="i-heroicons-user"
        />
      </UFormGroup>

      <!-- 密码 -->
      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          class="w-full"
          type="password"
          icon="i-heroicons-lock-closed"
        />
      </UFormGroup>

      <div class="flex items-center space-x-4">
        <!-- 登陆 -->
        <UButton :loading="isLoading" type="submit" icon="i-tabler:login">
          Login
        </UButton>

        <!-- 注册 -->
        <UButton icon="i-tabler:user-plus">Sign Up</UButton>
      </div>
    </UForm>
  </UCard>
</template>
