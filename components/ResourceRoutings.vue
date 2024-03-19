<script setup lang="ts">
import type { ConfigFormModal } from '#components'
import * as queries from '~/queries'

const apiStore = useAPIStore()

const isCreateModalOpen = ref(false)
const createFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()
const isUpdateFormModalOpen = ref(false)
const updateFormModalRef = ref<InstanceType<typeof ConfigFormModal>>()

const { state: configs, execute: refetchConfigs } = useAsyncState(async () => {
  const data = await apiStore.apiClient?.query(queries.configs, {})

  return data?.data?.configs
}, [])

const isRemovingConfig = ref(false)

const removeConfig = async (id: string | number) => {
  isRemovingConfig.value = true

  try {
    await apiStore.apiClient?.mutation(
      graphql(`
        mutation RemoveConfig($id: ID!) {
          removeConfig(id: $id)
        }
      `),
      { id }
    )

    await refetchConfigs()
  } finally {
    isRemovingConfig.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <UButton block icon="i-heroicons-plus" @click="isCreateModalOpen = true" />

    <UCard v-for="config in configs" :key="config.id">
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
                updateFormModalRef?.setValues({
                  name: config.name,
                  checkIntervalSeconds: deriveTime(
                    config.global.checkInterval as string,
                    's'
                  ),
                  sniffingTimeoutMS: deriveTime(
                    config.global.sniffingTimeout as string,
                    'ms'
                  ),
                  checkToleranceMS: deriveTime(
                    config.global.checkTolerance as string,
                    'ms'
                  ),
                  ...config.global
                })

                isUpdateFormModalOpen = true
              }
            "
          />

          <UButton
            :loading="isRemovingConfig"
            size="xs"
            icon="i-heroicons-minus"
            @click="removeConfig(config.id)"
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
          await refetchConfigs()

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
          await refetchConfigs()

          isUpdateFormModalOpen = false
        }
      "
    />
  </div>
</template>
