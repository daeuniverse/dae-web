<script setup lang="ts">
import type { ConfigFormModal } from '#components'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isCreateModalOpen = ref(false)
const createFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()
const isUpdateFormModalOpen = ref(false)
const updateFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()

const { state: groups, execute: refetchGroups } = useAsyncState(async () => {
  const data = await apiStore.apiClient?.query(queries.groups, {})

  return data?.data?.groups
}, [])

const isRemovingGroup = ref(false)

const removeGroup = async (id: string | number) => {
  isRemovingGroup.value = true

  try {
    await apiStore.apiClient?.mutation(
      graphql(`
        mutation RemoveConfig($id: ID!) {
          removeConfig(id: $id)
        }
      `),
      { id }
    )

    await refetchGroups()
  } finally {
    isRemovingGroup.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <UButton block icon="i-heroicons-plus" @click="isCreateModalOpen = true" />

    <UCard v-for="config in groups" :key="config.id">
      <template #header>
        {{ config.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            size="xs"
            icon="i-heroicons-pencil"
            @click="
              () => {
                isUpdateFormModalOpen = true
              }
            "
          />

          <UButton
            :loading="isRemovingGroup"
            size="xs"
            icon="i-heroicons-minus"
            @click="removeGroup(config.id)"
          />
        </div>
      </template>
    </UCard>

    <ConfigFormModal
      ref="createFormModalRef"
      v-model="isCreateModalOpen"
      type="create"
      @submit="
        async () => {
          await refetchGroups()

          isCreateModalOpen = false
        }
      "
    />

    <ConfigFormModal
      ref="updateFormModalRef"
      v-model="isUpdateFormModalOpen"
      type="update"
      @submit="
        async () => {
          await refetchGroups()

          isUpdateFormModalOpen = false
        }
      "
    />
  </div>
</template>
