<script setup lang="ts">
import type { ResultOf } from 'gql.tada'
import * as mutations from '~/mutations'
import type * as queries from '~/queries'

defineProps<{ config: ResultOf<typeof queries.configs>['configs'][number] }>()

const emit = defineEmits<{
  (event: 'reloadConfigs'): void
}>()

const apiStore = useAPIStore()

const { data: defaults } = useAsyncData('defaults', () =>
  apiStore.getDefaults()
)

const isEditModalVisible = ref(false)
const isRemovingConfig = ref(false)

const removeConfig = async (id: string) => {
  isRemovingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.removeConfig, { id })
    emit('reloadConfigs')
  } finally {
    isRemovingConfig.value = false
  }
}

const isSelectingConfig = ref(false)

const selectConfig = async (id: string) => {
  isSelectingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(mutations.selectConfig, { id })

    emit('reloadConfigs')
  } finally {
    isSelectingConfig.value = false
  }
}
</script>

<template>
  <Card>
    <template #title>
      {{ config.name }}
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          class="space-x-1"
          label="Edit"
          size="small"
          @click="isEditModalVisible = true"
        >
          <template #icon>
            <Icon name="i-heroicons:pencil" />
          </template>
        </Button>

        <Button
          class="space-x-1"
          label="Remove"
          size="small"
          severity="danger"
          :loading="isRemovingConfig"
          :disabled="config.id === defaults?.defaultConfigID || config.selected"
          @click="removeConfig(config.id)"
        >
          <template #icon>
            <Icon name="i-heroicons:trash" />
          </template>
        </Button>

        <Button
          size="small"
          :loading="isSelectingConfig"
          :disabled="config.selected"
          @click="selectConfig(config.id)"
        >
          <template #icon>
            <Icon name="i-heroicons:map-pin" />
          </template>
        </Button>
      </div>
    </template>
  </Card>

  <ConfigFormModal v-model:visible="isEditModalVisible" :config="config" />
</template>
