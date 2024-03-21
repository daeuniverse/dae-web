<script setup lang="ts">
import type { ConfigFormModal } from '#components'
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()
const defaults = await apiStore.getDefaults()

const isCreateModalOpen = ref(false)
const createFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()
const isUpdateFormModalOpen = ref(false)
const updateFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()

const { data: groups, execute: reloadGroups } = useAsyncData(
  'groups',
  async () => {
    const data = await apiStore.apiClient?.query(queries.groups, {})

    return data?.data?.groups
  }
)

const isRemovingGroup = ref(false)

const removeGroup = async (id: string | number) => {
  isRemovingGroup.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeGroup, { id })

    await reloadGroups()
  } finally {
    isRemovingGroup.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <UButton block icon="i-heroicons-plus" @click="isCreateModalOpen = true" />

    <UCard v-for="group in groups" :key="group.id">
      <template #header>
        {{ group.name }}
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
            :disabled="group.id === defaults?.defaultGroupID"
            size="xs"
            icon="i-heroicons-minus"
            @click="removeGroup(group.id)"
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
          await reloadGroups()

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
          await reloadGroups()

          isUpdateFormModalOpen = false
        }
      "
    />
  </div>
</template>
