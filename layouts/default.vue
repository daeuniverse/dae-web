<script setup lang="ts">
import * as queries from '~/queries'

const apiStore = useAPIStore()

const { data: user } = useAsyncData(
  async () => (await apiStore.apiClient?.query(queries.user, {}))?.data?.user
)

const isSettingsModalOpen = ref(false)

const onFileChange = async (event: Event) => {
  const formData = new FormData()
  const file = (event.target as HTMLInputElement).files?.[0]

  if (!file) return

  formData.append('hello', file)

  const data = await $fetch('/api/avatar', {
    method: 'post',
    body: formData
  })

  console.log(data)
}

const items = [
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
    }
  ],
  [
    {
      label: 'Documentation',
      icon: 'i-heroicons-book-open'
    },
    {
      label: 'Changelog',
      icon: 'i-heroicons-megaphone'
    },
    {
      label: 'Status',
      icon: 'i-heroicons-signal'
    }
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle'
    }
  ]
]
</script>

<template>
  <UContainer>
    <header class="flex items-center justify-between py-4">
      <TextLogo />

      <div>
        <UDropdown
          :items="items"
          :ui="{ item: { disabled: 'cursor-text select-text' } }"
          :popper="{ placement: 'bottom-start' }"
        >
          <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />

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

      <UModal v-model="isSettingsModalOpen">
        <UCard>
          <template #header>Settings</template>

          hello world

          <template #footer>
            <div class="flex items-center justify-end gap-2">
              <UButton color="black">Reset</UButton>
              <UButton>Submit</UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </header>

    <slot />
  </UContainer>
</template>

<style>
@import 'splitpanes/dist/splitpanes.css';
</style>
