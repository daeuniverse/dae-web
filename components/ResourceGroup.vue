<script setup lang="ts">
import * as mutations from '~/mutations'
import * as queries from '~/queries'

const apiStore = useAPIStore()
const { data: defaults } = useAsyncData('defaults', () =>
  apiStore.getDefaults()
)

const isCreateModalOpen = ref(false)
const isUpdateFormModalOpen = ref(false)

const { data: groups, execute: reloadGroups } = useAsyncData(
  'groups',
  async () => {
    const data = await apiStore.apiClient?.query(queries.groups, {})

    return data?.data?.groups
  }
)

const isRemovingGroup = ref(false)

const removeGroup = async (id: string) => {
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
    <div class="flex justify-end">
      <Button icon="i-heroicons:plus" @click="isCreateModalOpen = true" />
    </div>

    <Card v-for="group in groups" :key="group.id">
      <template #header>
        {{ group.name }}
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            icon="i-heroicons:pencil"
            @click="
              () => {
                isUpdateFormModalOpen = true
              }
            "
          />

          <Button
            :loading="isRemovingGroup"
            :disabled="group.id === defaults?.defaultGroupID"
            icon="i-heroicons:minus"
            @click="removeGroup(group.id)"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
