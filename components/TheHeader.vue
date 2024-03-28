<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types'
import { z } from 'zod'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const { data: user, execute } = useAsyncData(
  'user',
  async () => (await apiStore.apiClient?.query(queries.user, {}))?.data?.user
)

const schema = z.object({
  name: z.string().min(4),
  avatar: z.string()
})

type Schema = z.output<typeof schema>

const initialState = computed(
  () =>
    ({
      name: user.value?.name ?? '',
      avatar: user.value?.avatar ?? ''
    }) satisfies Schema
)

const state = reactive<Schema>(initialState.value)

const avatarFileInputRef = ref<HTMLInputElement>()

const isSettingsModalOpen = ref(false)

const onAvatarChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('avatar', file)

  const avatar = await $fetch('/api/avatar', {
    method: 'post',
    body: formData
  })

  state.avatar = avatar

  if (avatarFileInputRef.value) {
    avatarFileInputRef.value.value = ''
  }
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  const { name, avatar } = event.data

  await apiStore.apiClient?.mutation(mutations.updateName, { name })
  await apiStore.apiClient?.mutation(mutations.updateAvatar, { avatar })
  await execute()

  isSettingsModalOpen.value = false
}

const onError = (event: FormErrorEvent) => {
  console.log(event)
}

const dropdownItems = [
  [
    {
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Settings',
      icon: 'i-heroicons-cog-8-tooth',
      click() {
        isSettingsModalOpen.value = true
      }
    },
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      async click() {
        apiStore.endpointURL = ''
        apiStore.token = ''

        await navigateTo('/setup', { replace: true })
      }
    }
  ]
]

const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>

<template>
  <header class="flex items-center justify-between py-4">
    <TextLogo />

    <ClientOnly>
      <div class="flex items-center gap-4">
        <UButton
          :icon="
            isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
          "
          color="gray"
          variant="ghost"
          aria-label="Theme"
          @click="isDark = !isDark"
        />

        <UDropdown
          :items="dropdownItems"
          :ui="{ item: { disabled: 'cursor-text select-text' } }"
          :popper="{ placement: 'bottom-start' }"
        >
          <UAvatar size="md" :src="state.avatar" :alt="state.name" />

          <template #account>
            <span class="truncate font-medium text-gray-900 dark:text-white">
              {{ user?.username }}
            </span>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon
              :name="item.icon"
              class="ms-auto h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
            />
          </template>
        </UDropdown>
      </div>
    </ClientOnly>

    <UModal v-model="isSettingsModalOpen">
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        @error="onError"
      >
        <UCard>
          <template #header>Settings</template>

          <div class="space-y-4">
            <UFormGroup label="Name" name="name">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Avatar" name="avatar">
              <UButton
                class="relative mx-auto block text-[0]"
                :ui="{ rounded: 'rounded-full' }"
                square
              >
                <UAvatar :src="state.avatar" size="2xl" :alt="state.name" />

                <input
                  ref="avatarFileInputRef"
                  type="file"
                  class="absolute inset-0 overflow-hidden opacity-0"
                  accept="image/*"
                  @change="onAvatarChange"
                />
              </UButton>
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex items-center justify-end gap-2">
              <UButton color="black">Reset</UButton>
              <UButton type="submit">Submit</UButton>
            </div>
          </template>
        </UCard>
      </UForm>
    </UModal>
  </header>
</template>
